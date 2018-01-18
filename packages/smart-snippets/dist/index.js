"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const gene_js_1 = require("gene-js");
const os = require("os");
const fs_extra_1 = require("fs-extra");
const copy_1 = require("./copy");
const workspaces = {
    default: `${os.homedir()}/.smart-snippets`
};
function saveSmartSnippet(base, _workspace = 'default') {
    return __awaiter(this, void 0, void 0, function* () {
        const basePad = new gene_js_1.FilePad();
        yield basePad.initialize(base);
        const target = yield buildArchetypePath(basePad, _workspace);
        if (fs_extra_1.existsSync(target)) {
            const targetPad = new gene_js_1.FilePad();
            yield targetPad.initialize(target);
            targetPad.checkCanBeUpdatedBy(basePad);
        }
        yield copy_1.default(base, target);
    });
}
exports.saveSmartSnippet = saveSmartSnippet;
function updateFromSmartSnippet(target, _workspace = 'default') {
    return __awaiter(this, void 0, void 0, function* () {
        const targetPad = new gene_js_1.FilePad();
        yield targetPad.initialize(target);
        const base = yield buildArchetypePath(targetPad, _workspace);
        const basePad = new gene_js_1.FilePad();
        yield basePad.initialize(base);
        targetPad.checkCanBeUpdatedBy(basePad);
        yield gene_js_1.updateRegions(base, target, { stdout: false });
    });
}
exports.updateFromSmartSnippet = updateFromSmartSnippet;
function buildArchetypePath(pad, _workspace) {
    return __awaiter(this, void 0, void 0, function* () {
        const archetype = pad.archetype;
        const extension = pad.delimiters.extension.replace('.', '');
        const workspace = workspaces[_workspace] || _workspace;
        const vault = `${workspace}/${extension}`;
        yield fs_extra_1.ensureDir(workspace);
        yield fs_extra_1.ensureDir(vault);
        return `${vault}/${archetype}.${extension}`;
    });
}
//# sourceMappingURL=index.js.map