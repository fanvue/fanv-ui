import path from "node:path";
import ts from "typescript";
import { describe, expect, it } from "vitest";

const HELPERS = new Set(["renderTextChildren", "renderContainedText", "renderSlottedText"]);
const SKIPPED_FILES = /\.(test|stories)\.tsx$|\/(Icons|AnimatedIcons|Flags)\//;
const TEXT_FLAGS = ts.TypeFlags.StringLike | ts.TypeFlags.NumberLike | ts.TypeFlags.BigIntLike;
const MAX_DEPTH = 5;

const HOW_TO_FIX = [
  "Text that shares a parent with other nodes breaks under browser page translation (ENG-18326).",
  "For each site listed below, do one of:",
  "  - build one template string and make it the only child of its element,",
  "  - wrap the text in its own <span>,",
  "  - pass a ReactNode prop through renderTextChildren / renderContainedText / renderSlottedText",
  "    from src/utils/renderTextChildren,",
  "  - type a value that is always an element as React.ReactElement.",
].join("\n");

function loadCompilerOptions() {
  const configPath = path.resolve("tsconfig.json");
  const { config } = ts.readConfigFile(configPath, ts.sys.readFile);
  return ts.parseJsonConfigFileContent(config, ts.sys, path.dirname(configPath)).options;
}

function componentFiles() {
  return ts.sys
    .readDirectory(path.resolve("src/components"), [".tsx"])
    .filter((file) => !SKIPPED_FILES.test(file));
}

function createProgram(files: string[], virtualFiles: Map<string, string>) {
  const options = loadCompilerOptions();
  const host = ts.createCompilerHost(options);
  const readFile = host.readFile.bind(host);
  const fileExists = host.fileExists.bind(host);
  host.readFile = (file) => virtualFiles.get(file) ?? readFile(file);
  host.fileExists = (file) => virtualFiles.has(file) || fileExists(file);
  return ts.createProgram(files, options, host);
}

function findUnguardedText(files: string[], virtualFiles = new Map<string, string>()) {
  const program = createProgram(files, virtualFiles);
  const checker = program.getTypeChecker();
  const scanned = new Set(files.map((file) => path.resolve(file)));
  const findings: string[] = [];

  const mayBeText = (type: ts.Type): boolean => {
    if (type.isUnion()) return type.types.some(mayBeText);
    if (type.isStringLiteral()) return type.value.trim() !== "";
    if (type.isNumberLiteral()) return type.value !== 0;
    if (type.flags & ts.TypeFlags.BigIntLiteral) {
      return (type as ts.BigIntLiteralType).value.base10Value !== "0";
    }
    return (type.flags & TEXT_FLAGS) !== 0;
  };

  const returnedExpressions = (body: ts.Node) => {
    const returned: ts.Expression[] = [];
    const visit = (node: ts.Node) => {
      if (ts.isFunctionLike(node)) return;
      if (ts.isReturnStatement(node) && node.expression) returned.push(node.expression);
      ts.forEachChild(node, visit);
    };
    ts.forEachChild(body, visit);
    return returned;
  };

  const localDeclaration = (identifier: ts.Expression) => {
    if (!ts.isIdentifier(identifier)) return undefined;
    const declaration = checker.getSymbolAtLocation(identifier)?.declarations?.[0];
    return declaration?.getSourceFile() === identifier.getSourceFile() ? declaration : undefined;
  };

  const resolveLocally = (expression: ts.Expression): ts.Expression[] | undefined => {
    if (ts.isCallExpression(expression)) {
      const declaration = localDeclaration(expression.expression);
      return declaration && ts.isFunctionDeclaration(declaration) && declaration.body
        ? returnedExpressions(declaration.body)
        : undefined;
    }
    const declaration = localDeclaration(expression);
    if (!declaration || !ts.isVariableDeclaration(declaration) || !declaration.initializer) {
      return undefined;
    }
    const isConst = (ts.getCombinedNodeFlags(declaration) & ts.NodeFlags.Const) !== 0;
    return isConst ? [declaration.initializer] : undefined;
  };

  const unwrap = (expression: ts.Expression) => {
    let node = expression;
    while (
      ts.isParenthesizedExpression(node) ||
      ts.isAsExpression(node) ||
      ts.isNonNullExpression(node)
    ) {
      node = node.expression;
    }
    return node;
  };

  const branches = (node: ts.Expression): ts.Expression[] | undefined => {
    if (ts.isConditionalExpression(node)) return [node.whenTrue, node.whenFalse];
    if (!ts.isBinaryExpression(node)) return undefined;
    const operator = node.operatorToken.kind;
    if (operator === ts.SyntaxKind.AmpersandAmpersandToken) return [node.right];
    return operator === ts.SyntaxKind.BarBarToken ||
      operator === ts.SyntaxKind.QuestionQuestionToken
      ? [node.left, node.right]
      : undefined;
  };

  const helperName = (expression: ts.Expression, depth = 0): string | undefined => {
    if (!ts.isIdentifier(expression) || depth > MAX_DEPTH) return undefined;
    let symbol = checker.getSymbolAtLocation(expression);
    if (symbol && symbol.flags & ts.SymbolFlags.Alias) symbol = checker.getAliasedSymbol(symbol);
    const declaration = symbol?.declarations?.[0];
    if (declaration && ts.isVariableDeclaration(declaration) && declaration.initializer) {
      return helperName(unwrap(declaration.initializer), depth + 1);
    }
    return symbol && HELPERS.has(symbol.name) ? symbol.name : undefined;
  };

  const calledHelper = (node: ts.Expression) =>
    ts.isCallExpression(node) ? helperName(unwrap(node.expression)) : undefined;

  const isUnguardedText = (node: ts.Expression, depth: number): boolean => {
    const parts = branches(node);
    if (parts) return parts.some((part) => isUnguarded(part, false, depth));
    if (!mayBeText(checker.getTypeAtLocation(node))) return false;
    const resolved = depth < MAX_DEPTH ? resolveLocally(node) : undefined;
    return resolved ? resolved.some((next) => isUnguarded(next, false, depth + 1)) : true;
  };

  const isUnguarded = (expression: ts.Expression, alone: boolean, depth = 0): boolean => {
    const node = unwrap(expression);
    if (ts.isJsxElement(node) || ts.isJsxSelfClosingElement(node)) return false;
    if (ts.isJsxFragment(node)) return unguardedChildren(node.children, alone).length > 0;
    if (ts.isArrayLiteralExpression(node)) {
      const single = alone && node.elements.length < 2;
      return node.elements.some((element) => isUnguarded(element, single, depth));
    }
    const helper = calledHelper(node);
    if (helper) return helper === "renderContainedText" && !alone;
    return alone ? false : isUnguardedText(node, depth);
  };

  const unguardedChildren = (nodes: readonly ts.JsxChild[], alone: boolean): ts.Node[] => {
    const children = nodes.filter((child) =>
      ts.isJsxText(child)
        ? child.text.trim() !== ""
        : !ts.isJsxExpression(child) || child.expression !== undefined,
    );
    const single = alone && children.length < 2;
    return children.filter((child) => {
      if (ts.isJsxText(child)) return !single;
      if (ts.isJsxFragment(child)) return unguardedChildren(child.children, single).length > 0;
      return ts.isJsxExpression(child) && child.expression
        ? isUnguarded(child.expression, single)
        : false;
    });
  };

  const isHostVariable = (declaration: ts.Declaration, sourceFile: ts.SourceFile) => {
    if (ts.isParameter(declaration) || ts.isBindingElement(declaration)) return true;
    if (!ts.isVariableDeclaration(declaration)) return false;
    if (declaration.getSourceFile() !== sourceFile) return false;
    const isLocal = !ts.isSourceFile(declaration.parent.parent.parent);
    return isLocal || (!!declaration.initializer && ts.isStringLiteral(declaration.initializer));
  };

  const placesChildrenInHost = (parent: ts.JsxElement | ts.JsxFragment) => {
    if (ts.isJsxFragment(parent)) return true;
    const tag = parent.openingElement.tagName;
    if (!ts.isIdentifier(tag) || /^[a-z]/.test(tag.text)) return true;
    const declaration = checker.getSymbolAtLocation(tag)?.declarations?.[0];
    return declaration ? isHostVariable(declaration, parent.getSourceFile()) : false;
  };

  const scanFile = (sourceFile: ts.SourceFile) => {
    const report = (parent: ts.JsxElement | ts.JsxFragment, child: ts.Node) => {
      const { line } = sourceFile.getLineAndCharacterOfPosition(child.getStart());
      const tag = ts.isJsxElement(parent) ? parent.openingElement.tagName.getText() : "";
      const snippet = child.getText().trim().replace(/\s+/g, " ").slice(0, 60);
      const file = path.relative(process.cwd(), sourceFile.fileName);
      findings.push(`${file}:${line + 1}  <${tag}>  ${snippet}`);
    };
    const check = (parent: ts.JsxElement | ts.JsxFragment) => {
      for (const child of unguardedChildren(parent.children, true)) report(parent, child);
    };
    const visit = (node: ts.Node) => {
      if ((ts.isJsxElement(node) || ts.isJsxFragment(node)) && placesChildrenInHost(node)) {
        check(node);
      }
      ts.forEachChild(node, visit);
    };
    visit(sourceFile);
  };

  for (const sourceFile of program.getSourceFiles()) {
    if (scanned.has(path.resolve(sourceFile.fileName))) scanFile(sourceFile);
  }
  return findings;
}

const FLAGGED: [string, string][] = [
  ["literal text beside an expression", "<p>Page {count}</p>"],
  ["a string beside an element", "<p>{label}<b /></p>"],
  ["a number beside an element", "<p><b />{count}</p>"],
  ["a ReactNode beside an element", "<div>{node}<b /></div>"],
  ["a string in a fragment", "<>{label}<b /></>"],
  ["a string in a conditional branch", "<p>{shown ? label : <i />}<b /></p>"],
  ["a string after a guard", "<p>{shown && label}<b /></p>"],
  ["a string in an array beside an element", '<div>{[label, <i key="icon" />]}</div>'],
  ["a string in a nested fragment beside an element", "<div><>{label}</><i /></div>"],
  ["contained text beside an element", "<div>{renderContainedText(label)}<i /></div>"],
  ["a string beside an element in an aliased host", "<Host>{label}<i /></Host>"],
];

const ACCEPTED: [string, string][] = [
  ["one combined string as the only child", "<p>{label + count}</p>"],
  ["a ReactNode as the only child", "<p>{node}</p>"],
  ["text in its own span", "<p><span>{label}</span><b /></p>"],
  ["a helper call", "<div>{renderTextChildren(node)}<b /></div>"],
  ["an element-typed value", "<div>{element}<b /></div>"],
  ["a guarded element", "<div>{label && <span>{label}</span>}<b /></div>"],
  ["a whitespace literal", '<p><i />{" "}<b /></p>'],
  ["an aliased helper call", "<div>{guard(node)}<b /></div>"],
  ["contained text as the only child", "<div>{renderContainedText(node)}</div>"],
];

function snippetFile(index: number) {
  return path.resolve(`src/components/__scan__/Sample${index}.tsx`);
}

function scanSnippets(bodies: string[]) {
  const sources = new Map(
    bodies.map((body, index) => [
      snippetFile(index),
      [
        'import type * as React from "react";',
        'import { renderContainedText, renderTextChildren } from "../../utils/renderTextChildren";',
        'const Host = "div";',
        "declare const label: string;",
        "declare const count: number;",
        "declare const node: React.ReactNode;",
        "declare const element: React.ReactElement | null;",
        "declare const shown: boolean;",
        "const guard = renderTextChildren;",
        `export const sample = ${body};`,
      ].join("\n"),
    ]),
  );
  const findings = findUnguardedText([...sources.keys()], sources);
  return bodies.map((_body, index) =>
    findings.filter((finding) => finding.includes(`Sample${index}.tsx:`)),
  );
}

const snippetFindings = scanSnippets([...FLAGGED, ...ACCEPTED].map(([, body]) => body));

describe("page translation text guard", () => {
  it.each(FLAGGED.map(([name], index) => [name, index] as const))("flags %s", (_name, index) => {
    expect(snippetFindings[index]).not.toEqual([]);
  });

  it.each(
    ACCEPTED.map(([name], index) => [name, FLAGGED.length + index] as const),
  )("accepts %s", (_name, index) => {
    expect(snippetFindings[index]).toEqual([]);
  });

  it("finds no unguarded text in src/components", () => {
    const findings = findUnguardedText(componentFiles());
    expect(findings, `${HOW_TO_FIX}\n\n${findings.join("\n")}\n`).toEqual([]);
  });
});
