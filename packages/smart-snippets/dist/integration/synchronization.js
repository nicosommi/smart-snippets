"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const cucumber_tsflow_1 = require("cucumber-tsflow");
const shelljs_1 = require("shelljs");
const copy_1 = require("../copy");
const fs = require("fs-extra");
const os = require("os");
const _1 = require("../");
const expect = require("expect");
const { Given, When, Then } = require('cucumber');
const testWorkspace = `${__dirname}/.testws`;
let WorldPart = class WorldPart {
    constructor() {
        this.properties = {};
        this.clean = [];
        this.arguments = {};
    }
    before() {
        return __awaiter(this, void 0, void 0, function* () { });
    }
    after() {
        return __awaiter(this, void 0, void 0, function* () {
            // console.log('after cleanup')
            yield Promise.all(this.clean.map(f => f()));
        });
    }
    aSpecificFile(propertyName) {
        return __awaiter(this, void 0, void 0, function* () {
            this.properties[propertyName] = `${__dirname}/../../fixtures/example.archetype.ts`;
        });
    }
    aSpecificOldFile(propertyName) {
        return __awaiter(this, void 0, void 0, function* () {
            this.properties[propertyName] = `${__dirname}/../../fixtures/example.archetype.old.ts`;
        });
    }
    anExistingArcheytpeFrom(propertyName) {
        return __awaiter(this, void 0, void 0, function* () {
            const source = this.properties[propertyName];
            const archetype = `${os.homedir()}/.smart-snippets/ts/fruit.ts`;
            yield copy_1.default(source, archetype);
            this.clean.push(() => shelljs_1.rm(archetype));
        });
    }
    passesThatFileAsAnArgument(propertyName, argumentName) {
        return __awaiter(this, void 0, void 0, function* () {
            this.arguments[argumentName] = this.properties[propertyName];
        });
    }
    passesThatFileAsTheTargetArgument(propertyName) {
        return __awaiter(this, void 0, void 0, function* () {
            // backup file
            const backupPath = `${this.properties[propertyName]}.bkp`;
            yield copy_1.default(this.properties[propertyName], backupPath);
            this.arguments['target'] = this.properties[propertyName];
            this.clean.push(() => copy_1.default(backupPath, this.properties[propertyName]));
        });
    }
    theUserExecutesTheCommandSmartsnippetscreate(subcommand) {
        return __awaiter(this, void 0, void 0, function* () {
            switch (subcommand.toLowerCase()) {
                case 'save':
                    yield _1.saveSmartSnippet(this.arguments['base'], testWorkspace);
                    break;
                case 'update':
                    yield _1.updateFromSmartSnippet(this.arguments['target'], testWorkspace);
                    break;
            }
        });
    }
    itShouldSaveAFileNamedAsTheArchetypeInThedefaultWorkspace(workspace) {
        const target = `${os.homedir()}/.smart-snippets/ts/fruit.ts`;
        expect(fs.existsSync(target)).toBe(true);
        this.clean.push(() => shelljs_1.rm(target));
    }
    itShouldRefreshTheFileToTheLastVersionOfIt() {
        return __awaiter(this, void 0, void 0, function* () {
            const expected = fs.readFileSync(`${__dirname}/../../fixtures/expectation.archetype.ts`, { encoding: 'utf8' });
            const actual = fs.readFileSync(this.arguments['target'], { encoding: 'utf8' });
            expect(actual).toEqual(expected);
        });
    }
};
__decorate([
    cucumber_tsflow_1.before()
], WorldPart.prototype, "before", null);
__decorate([
    cucumber_tsflow_1.after()
], WorldPart.prototype, "after", null);
__decorate([
    cucumber_tsflow_1.given(/a valid archetype path on '([\w]*)'/)
], WorldPart.prototype, "aSpecificFile", null);
__decorate([
    cucumber_tsflow_1.given(/a valid old archetype path on '([\w]*)'/)
], WorldPart.prototype, "aSpecificOldFile", null);
__decorate([
    cucumber_tsflow_1.given(/an existing archetype from '([\w]*)'/)
], WorldPart.prototype, "anExistingArcheytpeFrom", null);
__decorate([
    cucumber_tsflow_1.given(/passes '([\w]*)' as the '([\w]*)' argument/)
], WorldPart.prototype, "passesThatFileAsAnArgument", null);
__decorate([
    cucumber_tsflow_1.given(/passes '([\w]*)' as the target argument/)
], WorldPart.prototype, "passesThatFileAsTheTargetArgument", null);
__decorate([
    cucumber_tsflow_1.when(/the user executes the command smart-snippets '([\w]*)'/)
], WorldPart.prototype, "theUserExecutesTheCommandSmartsnippetscreate", null);
__decorate([
    cucumber_tsflow_1.then(/it should save a file named as the archetype in the '([\w]*)' workspace/)
], WorldPart.prototype, "itShouldSaveAFileNamedAsTheArchetypeInThedefaultWorkspace", null);
__decorate([
    cucumber_tsflow_1.then(/it should refresh the file to the last version of it/)
], WorldPart.prototype, "itShouldRefreshTheFileToTheLastVersionOfIt", null);
WorldPart = __decorate([
    cucumber_tsflow_1.binding()
], WorldPart);
exports.default = WorldPart;
//# sourceMappingURL=synchronization.js.map