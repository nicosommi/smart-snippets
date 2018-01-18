#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const commands_1 = require("../commands");
process.on('unhandledRejection', error => {
    throw error;
});
commands_1.default();
//# sourceMappingURL=smartSnippets.js.map