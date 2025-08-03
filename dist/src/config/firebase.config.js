"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.firebaseConfig = void 0;
const fs_1 = require("fs");
const admin = require("firebase-admin");
const path_1 = require("path");
exports.firebaseConfig = {
    provide: "FIREBASE_APP",
    useFactory: () => {
        const serviceAccountPath = (0, path_1.join)("./fcm-service-account.json");
        const serviceAccount = JSON.parse((0, fs_1.readFileSync)(serviceAccountPath, "utf8"));
        return admin.initializeApp({
            credential: admin.credential.cert(serviceAccount),
        });
    },
};
//# sourceMappingURL=firebase.config.js.map