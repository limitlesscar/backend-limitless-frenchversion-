"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConnectionType = exports.RegexError = exports.AuthorizationHeader = void 0;
var AuthorizationHeader;
(function (AuthorizationHeader) {
    AuthorizationHeader["BEARER"] = "Bearer Authorization";
})(AuthorizationHeader || (exports.AuthorizationHeader = AuthorizationHeader = {}));
var RegexError;
(function (RegexError) {
    RegexError["ALPHABETIC"] = "must only contain letters and spaces";
    RegexError["ALPHANUMERIC"] = "must only contain letters, numbers, and spaces";
    RegexError["NUMERIC"] = "must only contain numbers";
})(RegexError || (exports.RegexError = RegexError = {}));
var ConnectionType;
(function (ConnectionType) {
    ConnectionType["WS"] = "ws";
    ConnectionType["HTTP"] = "http";
})(ConnectionType || (exports.ConnectionType = ConnectionType = {}));
//# sourceMappingURL=common.type.js.map