"use strict";
// Type definitions for cucumber-js 3.2
// Project: https://github.com/cucumber/cucumber-js
// Definitions by: Abraão Alves <https://github.com/abraaoalves>
//                 Jan Molak <https://github.com/jan-molak>
//                 Isaiah Soung <https://github.com/isoung>
//                 BendingBender <https://github.com/BendingBender>
//                 ErikSchierboom <https://github.com/ErikSchierboom>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped
// TypeScript Version: 2.4
Object.defineProperty(exports, "__esModule", { value: true });
var Status;
(function (Status) {
    Status["AMBIGUOUS"] = "ambiguous";
    Status["FAILED"] = "failed";
    Status["PASSED"] = "passed";
    Status["PENDING"] = "pending";
    Status["SKIPPED"] = "skipped";
    Status["UNDEFINED"] = "undefined";
})(Status = exports.Status || (exports.Status = {}));
class EventListener {
}
exports.EventListener = EventListener;
// https://github.com/cucumber/cucumber-js/commit/231183a8a11c985ef7ced1155b7a75f5120a34b6
class Formatter {
}
exports.Formatter = Formatter;
class SummaryFormatter extends Formatter {
}
exports.SummaryFormatter = SummaryFormatter;
class PrettyFormatter extends SummaryFormatter {
}
exports.PrettyFormatter = PrettyFormatter;
class ProgressFormatter extends SummaryFormatter {
}
exports.ProgressFormatter = ProgressFormatter;
class RerunFormatter extends Formatter {
}
exports.RerunFormatter = RerunFormatter;
class SnippetsFormatter extends Formatter {
}
exports.SnippetsFormatter = SnippetsFormatter;
class UsageFormatter extends Formatter {
}
exports.UsageFormatter = UsageFormatter;
class UsageJsonFormatter extends Formatter {
}
exports.UsageJsonFormatter = UsageJsonFormatter;
class JsonFormatter extends Formatter {
}
exports.JsonFormatter = JsonFormatter;
//# sourceMappingURL=types.js.map