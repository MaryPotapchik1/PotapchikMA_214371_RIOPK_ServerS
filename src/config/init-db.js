"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var db_1 = require("./db");
function initDb() {
    return __awaiter(this, void 0, void 0, function () {
        var infoCount, faqCount, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 13, , 14]);
                    return [4 /*yield*/, db_1.default.query("\n      CREATE TABLE IF NOT EXISTS applications (\n        id SERIAL PRIMARY KEY,\n        user_id INTEGER NOT NULL,\n        application_type VARCHAR(50) NOT NULL,\n        status VARCHAR(50) NOT NULL DEFAULT 'pending',\n        requested_amount NUMERIC NOT NULL,\n        approved_amount NUMERIC,\n        purpose TEXT NOT NULL,\n        description TEXT,\n        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,\n        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP\n      );\n    ")];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, db_1.default.query("\n      CREATE TABLE IF NOT EXISTS application_documents (\n        id SERIAL PRIMARY KEY,\n        application_id INTEGER NOT NULL REFERENCES applications(id) ON DELETE CASCADE,\n        document_name VARCHAR(255) NOT NULL,\n        document_path TEXT NOT NULL,\n        uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP\n      );\n    ")];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, db_1.default.query("\n      CREATE TABLE IF NOT EXISTS application_comments (\n        id SERIAL PRIMARY KEY,\n        application_id INTEGER NOT NULL REFERENCES applications(id) ON DELETE CASCADE,\n        user_id INTEGER NOT NULL,\n        is_admin BOOLEAN NOT NULL DEFAULT FALSE,\n        comment TEXT NOT NULL,\n        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP\n      );\n    ")];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, db_1.default.query("\n      CREATE TABLE IF NOT EXISTS info_materials (\n        id SERIAL PRIMARY KEY,\n        title VARCHAR(255) NOT NULL,\n        content TEXT NOT NULL,\n        category VARCHAR(100) NOT NULL,\n        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,\n        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP\n      );\n    ")];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, db_1.default.query("\n      CREATE TABLE IF NOT EXISTS faq (\n        id SERIAL PRIMARY KEY,\n        question TEXT NOT NULL,\n        answer TEXT NOT NULL,\n        category VARCHAR(100),\n        is_published BOOLEAN DEFAULT TRUE,\n        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP\n      );\n    ")];
                case 5:
                    _a.sent();
                    return [4 /*yield*/, db_1.default.query("\n      CREATE TABLE IF NOT EXISTS consultation_requests (\n        id SERIAL PRIMARY KEY,\n        user_id INTEGER NOT NULL,\n        name VARCHAR(255) NOT NULL,\n        email VARCHAR(255) NOT NULL,\n        phone VARCHAR(50),\n        subject VARCHAR(255) NOT NULL,\n        message TEXT NOT NULL,\n        status VARCHAR(50) DEFAULT 'pending',\n        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP\n      );\n    ")];
                case 6:
                    _a.sent();
                    return [4 /*yield*/, db_1.default.query('SELECT COUNT(*) FROM info_materials')];
                case 7:
                    infoCount = _a.sent();
                    if (!(infoCount.rows[0].count === '0')) return [3 /*break*/, 9];
                    return [4 /*yield*/, db_1.default.query("\n        INSERT INTO info_materials (title, content, category) VALUES \n        ('\u041C\u0430\u0442\u0435\u0440\u0438\u043D\u0441\u043A\u0438\u0439 \u043A\u0430\u043F\u0438\u0442\u0430\u043B \u0432 \u0420\u0435\u0441\u043F\u0443\u0431\u043B\u0438\u043A\u0435 \u0411\u0435\u043B\u0430\u0440\u0443\u0441\u044C', '\u041C\u0430\u0442\u0435\u0440\u0438\u043D\u0441\u043A\u0438\u0439 \u043A\u0430\u043F\u0438\u0442\u0430\u043B - \u044D\u0442\u043E \u0433\u043E\u0441\u0443\u0434\u0430\u0440\u0441\u0442\u0432\u0435\u043D\u043D\u0430\u044F \u043F\u0440\u043E\u0433\u0440\u0430\u043C\u043C\u0430 \u043F\u043E\u0434\u0434\u0435\u0440\u0436\u043A\u0438 \u0441\u0435\u043C\u0435\u0439 \u0441 \u0434\u0435\u0442\u044C\u043C\u0438...', 'general_info'),\n        ('\u041F\u043E\u043B\u0443\u0447\u0435\u043D\u0438\u0435 \u043C\u0430\u0442\u0435\u0440\u0438\u043D\u0441\u043A\u043E\u0433\u043E \u043A\u0430\u043F\u0438\u0442\u0430\u043B\u0430', '\u0414\u043B\u044F \u043F\u043E\u043B\u0443\u0447\u0435\u043D\u0438\u044F \u043C\u0430\u0442\u0435\u0440\u0438\u043D\u0441\u043A\u043E\u0433\u043E \u043A\u0430\u043F\u0438\u0442\u0430\u043B\u0430 \u043D\u0435\u043E\u0431\u0445\u043E\u0434\u0438\u043C\u043E \u043F\u043E\u0434\u0430\u0442\u044C \u0437\u0430\u044F\u0432\u043B\u0435\u043D\u0438\u0435...', 'how_to_get'),\n        ('\u0418\u0441\u043F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u043D\u0438\u0435 \u043C\u0430\u0442\u0435\u0440\u0438\u043D\u0441\u043A\u043E\u0433\u043E \u043A\u0430\u043F\u0438\u0442\u0430\u043B\u0430 \u043D\u0430 \u0443\u043B\u0443\u0447\u0448\u0435\u043D\u0438\u0435 \u0436\u0438\u043B\u0438\u0449\u043D\u044B\u0445 \u0443\u0441\u043B\u043E\u0432\u0438\u0439', '\u041C\u0430\u0442\u0435\u0440\u0438\u043D\u0441\u043A\u0438\u0439 \u043A\u0430\u043F\u0438\u0442\u0430\u043B \u043C\u043E\u0436\u043D\u043E \u0438\u0441\u043F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u044C \u0434\u043B\u044F \u0443\u043B\u0443\u0447\u0448\u0435\u043D\u0438\u044F \u0436\u0438\u043B\u0438\u0449\u043D\u044B\u0445 \u0443\u0441\u043B\u043E\u0432\u0438\u0439...', 'housing'),\n        ('\u0418\u0441\u043F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u043D\u0438\u0435 \u043C\u0430\u0442\u0435\u0440\u0438\u043D\u0441\u043A\u043E\u0433\u043E \u043A\u0430\u043F\u0438\u0442\u0430\u043B\u0430 \u043D\u0430 \u043E\u0431\u0440\u0430\u0437\u043E\u0432\u0430\u043D\u0438\u0435', '\u041C\u0430\u0442\u0435\u0440\u0438\u043D\u0441\u043A\u0438\u0439 \u043A\u0430\u043F\u0438\u0442\u0430\u043B \u043C\u043E\u0436\u043D\u043E \u0438\u0441\u043F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u044C \u0434\u043B\u044F \u043E\u043F\u043B\u0430\u0442\u044B \u043E\u0431\u0440\u0430\u0437\u043E\u0432\u0430\u043D\u0438\u044F \u0434\u0435\u0442\u0435\u0439...', 'education'),\n        ('\u0418\u0441\u043F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u043D\u0438\u0435 \u043C\u0430\u0442\u0435\u0440\u0438\u043D\u0441\u043A\u043E\u0433\u043E \u043A\u0430\u043F\u0438\u0442\u0430\u043B\u0430 \u043D\u0430 \u043B\u0435\u0447\u0435\u043D\u0438\u0435', '\u041C\u0430\u0442\u0435\u0440\u0438\u043D\u0441\u043A\u0438\u0439 \u043A\u0430\u043F\u0438\u0442\u0430\u043B \u043C\u043E\u0436\u043D\u043E \u0438\u0441\u043F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u044C \u0434\u043B\u044F \u043E\u043F\u043B\u0430\u0442\u044B \u043C\u0435\u0434\u0438\u0446\u0438\u043D\u0441\u043A\u0438\u0445 \u0443\u0441\u043B\u0443\u0433...', 'healthcare'),\n        ('\u0417\u0430\u043A\u043E\u043D\u043E\u0434\u0430\u0442\u0435\u043B\u044C\u0441\u0442\u0432\u043E \u043E \u043C\u0430\u0442\u0435\u0440\u0438\u043D\u0441\u043A\u043E\u043C \u043A\u0430\u043F\u0438\u0442\u0430\u043B\u0435', '\u041E\u0441\u043D\u043E\u0432\u043D\u044B\u043C \u0437\u0430\u043A\u043E\u043D\u043E\u043C, \u0440\u0435\u0433\u0443\u043B\u0438\u0440\u0443\u044E\u0449\u0438\u043C \u043F\u0440\u043E\u0433\u0440\u0430\u043C\u043C\u0443 \u043C\u0430\u0442\u0435\u0440\u0438\u043D\u0441\u043A\u043E\u0433\u043E \u043A\u0430\u043F\u0438\u0442\u0430\u043B\u0430, \u044F\u0432\u043B\u044F\u0435\u0442\u0441\u044F...', 'legislation')\n      ")];
                case 8:
                    _a.sent();
                    console.log('Добавлены информационные материалы');
                    _a.label = 9;
                case 9: return [4 /*yield*/, db_1.default.query('SELECT COUNT(*) FROM faq')];
                case 10:
                    faqCount = _a.sent();
                    if (!(faqCount.rows[0].count === '0')) return [3 /*break*/, 12];
                    return [4 /*yield*/, db_1.default.query("\n        INSERT INTO faq (question, answer, category) VALUES \n        ('\u041A\u0442\u043E \u0438\u043C\u0435\u0435\u0442 \u043F\u0440\u0430\u0432\u043E \u043D\u0430 \u043F\u043E\u043B\u0443\u0447\u0435\u043D\u0438\u0435 \u043C\u0430\u0442\u0435\u0440\u0438\u043D\u0441\u043A\u043E\u0433\u043E \u043A\u0430\u043F\u0438\u0442\u0430\u043B\u0430?', '\u041F\u0440\u0430\u0432\u043E \u043D\u0430 \u043F\u043E\u043B\u0443\u0447\u0435\u043D\u0438\u0435 \u043C\u0430\u0442\u0435\u0440\u0438\u043D\u0441\u043A\u043E\u0433\u043E \u043A\u0430\u043F\u0438\u0442\u0430\u043B\u0430 \u0438\u043C\u0435\u044E\u0442 \u0441\u0435\u043C\u044C\u0438, \u0432 \u043A\u043E\u0442\u043E\u0440\u044B\u0445 \u0440\u043E\u0434\u0438\u043B\u0441\u044F \u0438\u043B\u0438 \u0431\u044B\u043B \u0443\u0441\u044B\u043D\u043E\u0432\u043B\u0435\u043D \u0432\u0442\u043E\u0440\u043E\u0439 \u0440\u0435\u0431\u0435\u043D\u043E\u043A, \u043D\u0430\u0447\u0438\u043D\u0430\u044F \u0441 1 \u044F\u043D\u0432\u0430\u0440\u044F 2015 \u0433\u043E\u0434\u0430.', 'eligibility'),\n        ('\u041A\u0430\u043A\u043E\u0432\u0430 \u0441\u0443\u043C\u043C\u0430 \u043C\u0430\u0442\u0435\u0440\u0438\u043D\u0441\u043A\u043E\u0433\u043E \u043A\u0430\u043F\u0438\u0442\u0430\u043B\u0430?', '\u0421\u0443\u043C\u043C\u0430 \u043C\u0430\u0442\u0435\u0440\u0438\u043D\u0441\u043A\u043E\u0433\u043E \u043A\u0430\u043F\u0438\u0442\u0430\u043B\u0430 \u0441\u043E\u0441\u0442\u0430\u0432\u043B\u044F\u0435\u0442 10 000 \u0434\u043E\u043B\u043B\u0430\u0440\u043E\u0432 \u0421\u0428\u0410 \u0432 \u044D\u043A\u0432\u0438\u0432\u0430\u043B\u0435\u043D\u0442\u0435.', 'amount'),\n        ('\u041A\u043E\u0433\u0434\u0430 \u043C\u043E\u0436\u043D\u043E \u0438\u0441\u043F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u044C \u043C\u0430\u0442\u0435\u0440\u0438\u043D\u0441\u043A\u0438\u0439 \u043A\u0430\u043F\u0438\u0442\u0430\u043B?', '\u041C\u0430\u0442\u0435\u0440\u0438\u043D\u0441\u043A\u0438\u0439 \u043A\u0430\u043F\u0438\u0442\u0430\u043B \u043C\u043E\u0436\u043D\u043E \u0438\u0441\u043F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u044C \u043F\u043E\u0441\u043B\u0435 \u0442\u043E\u0433\u043E, \u043A\u0430\u043A \u0440\u0435\u0431\u0435\u043D\u043A\u0443, \u0432 \u0441\u0432\u044F\u0437\u0438 \u0441 \u0440\u043E\u0436\u0434\u0435\u043D\u0438\u0435\u043C \u043A\u043E\u0442\u043E\u0440\u043E\u0433\u043E \u0432\u043E\u0437\u043D\u0438\u043A\u043B\u043E \u043F\u0440\u0430\u0432\u043E \u043D\u0430 \u043C\u0430\u0442\u0435\u0440\u0438\u043D\u0441\u043A\u0438\u0439 \u043A\u0430\u043F\u0438\u0442\u0430\u043B, \u0438\u0441\u043F\u043E\u043B\u043D\u0438\u0442\u0441\u044F 3 \u0433\u043E\u0434\u0430.', 'timeframe'),\n        ('\u041C\u043E\u0436\u043D\u043E \u043B\u0438 \u0438\u0441\u043F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u044C \u043C\u0430\u0442\u0435\u0440\u0438\u043D\u0441\u043A\u0438\u0439 \u043A\u0430\u043F\u0438\u0442\u0430\u043B \u043D\u0430 \u043F\u043E\u043A\u0443\u043F\u043A\u0443 \u0430\u0432\u0442\u043E\u043C\u043E\u0431\u0438\u043B\u044F?', '\u041D\u0435\u0442, \u0434\u0435\u0439\u0441\u0442\u0432\u0443\u044E\u0449\u0435\u0435 \u0437\u0430\u043A\u043E\u043D\u043E\u0434\u0430\u0442\u0435\u043B\u044C\u0441\u0442\u0432\u043E \u043D\u0435 \u043F\u0440\u0435\u0434\u0443\u0441\u043C\u0430\u0442\u0440\u0438\u0432\u0430\u0435\u0442 \u0432\u043E\u0437\u043C\u043E\u0436\u043D\u043E\u0441\u0442\u044C \u0438\u0441\u043F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u043D\u0438\u044F \u043C\u0430\u0442\u0435\u0440\u0438\u043D\u0441\u043A\u043E\u0433\u043E \u043A\u0430\u043F\u0438\u0442\u0430\u043B\u0430 \u043D\u0430 \u043F\u043E\u043A\u0443\u043F\u043A\u0443 \u0430\u0432\u0442\u043E\u043C\u043E\u0431\u0438\u043B\u044F.', 'usage'),\n        ('\u041C\u043E\u0436\u043D\u043E \u043B\u0438 \u043F\u043E\u043B\u0443\u0447\u0438\u0442\u044C \u043C\u0430\u0442\u0435\u0440\u0438\u043D\u0441\u043A\u0438\u0439 \u043A\u0430\u043F\u0438\u0442\u0430\u043B \u043D\u0430\u043B\u0438\u0447\u043D\u044B\u043C\u0438?', '\u041D\u0435\u0442, \u043C\u0430\u0442\u0435\u0440\u0438\u043D\u0441\u043A\u0438\u0439 \u043A\u0430\u043F\u0438\u0442\u0430\u043B \u043D\u0435\u043B\u044C\u0437\u044F \u043F\u043E\u043B\u0443\u0447\u0438\u0442\u044C \u043D\u0430\u043B\u0438\u0447\u043D\u044B\u043C\u0438. \u0421\u0440\u0435\u0434\u0441\u0442\u0432\u0430 \u043F\u0435\u0440\u0435\u0447\u0438\u0441\u043B\u044F\u044E\u0442\u0441\u044F \u0431\u0435\u0437\u043D\u0430\u043B\u0438\u0447\u043D\u044B\u043C \u043F\u0443\u0442\u0435\u043C \u043D\u0430 \u0446\u0435\u043B\u0435\u0432\u044B\u0435 \u043D\u0443\u0436\u0434\u044B.', 'disbursement'),\n        ('\u041D\u0443\u0436\u043D\u043E \u043B\u0438 \u043F\u043B\u0430\u0442\u0438\u0442\u044C \u043D\u0430\u043B\u043E\u0433 \u0441 \u043C\u0430\u0442\u0435\u0440\u0438\u043D\u0441\u043A\u043E\u0433\u043E \u043A\u0430\u043F\u0438\u0442\u0430\u043B\u0430?', '\u041D\u0435\u0442, \u043C\u0430\u0442\u0435\u0440\u0438\u043D\u0441\u043A\u0438\u0439 \u043A\u0430\u043F\u0438\u0442\u0430\u043B \u043D\u0435 \u043E\u0431\u043B\u0430\u0433\u0430\u0435\u0442\u0441\u044F \u043D\u0430\u043B\u043E\u0433\u043E\u043C \u043D\u0430 \u0434\u043E\u0445\u043E\u0434\u044B \u0444\u0438\u0437\u0438\u0447\u0435\u0441\u043A\u0438\u0445 \u043B\u0438\u0446.', 'taxes')\n      ")];
                case 11:
                    _a.sent();
                    console.log('Добавлены FAQ');
                    _a.label = 12;
                case 12:
                    console.log('База данных инициализирована успешно');
                    return [3 /*break*/, 14];
                case 13:
                    error_1 = _a.sent();
                    console.error('Ошибка инициализации базы данных:', error_1);
                    throw error_1;
                case 14: return [2 /*return*/];
            }
        });
    });
}
exports.default = initDb;
