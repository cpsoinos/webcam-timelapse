"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// node_modules/.pnpm/dotenv@16.3.1/node_modules/dotenv/package.json
var require_package = __commonJS({
  "node_modules/.pnpm/dotenv@16.3.1/node_modules/dotenv/package.json"(exports, module2) {
    module2.exports = {
      name: "dotenv",
      version: "16.3.1",
      description: "Loads environment variables from .env file",
      main: "lib/main.js",
      types: "lib/main.d.ts",
      exports: {
        ".": {
          types: "./lib/main.d.ts",
          require: "./lib/main.js",
          default: "./lib/main.js"
        },
        "./config": "./config.js",
        "./config.js": "./config.js",
        "./lib/env-options": "./lib/env-options.js",
        "./lib/env-options.js": "./lib/env-options.js",
        "./lib/cli-options": "./lib/cli-options.js",
        "./lib/cli-options.js": "./lib/cli-options.js",
        "./package.json": "./package.json"
      },
      scripts: {
        "dts-check": "tsc --project tests/types/tsconfig.json",
        lint: "standard",
        "lint-readme": "standard-markdown",
        pretest: "npm run lint && npm run dts-check",
        test: "tap tests/*.js --100 -Rspec",
        prerelease: "npm test",
        release: "standard-version"
      },
      repository: {
        type: "git",
        url: "git://github.com/motdotla/dotenv.git"
      },
      funding: "https://github.com/motdotla/dotenv?sponsor=1",
      keywords: [
        "dotenv",
        "env",
        ".env",
        "environment",
        "variables",
        "config",
        "settings"
      ],
      readmeFilename: "README.md",
      license: "BSD-2-Clause",
      devDependencies: {
        "@definitelytyped/dtslint": "^0.0.133",
        "@types/node": "^18.11.3",
        decache: "^4.6.1",
        sinon: "^14.0.1",
        standard: "^17.0.0",
        "standard-markdown": "^7.1.0",
        "standard-version": "^9.5.0",
        tap: "^16.3.0",
        tar: "^6.1.11",
        typescript: "^4.8.4"
      },
      engines: {
        node: ">=12"
      },
      browser: {
        fs: false
      }
    };
  }
});

// node_modules/.pnpm/dotenv@16.3.1/node_modules/dotenv/lib/main.js
var require_main = __commonJS({
  "node_modules/.pnpm/dotenv@16.3.1/node_modules/dotenv/lib/main.js"(exports, module2) {
    "use strict";
    var fs = require("fs");
    var path = require("path");
    var os = require("os");
    var crypto2 = require("crypto");
    var packageJson = require_package();
    var version = packageJson.version;
    var LINE = /(?:^|^)\s*(?:export\s+)?([\w.-]+)(?:\s*=\s*?|:\s+?)(\s*'(?:\\'|[^'])*'|\s*"(?:\\"|[^"])*"|\s*`(?:\\`|[^`])*`|[^#\r\n]+)?\s*(?:#.*)?(?:$|$)/mg;
    function parse3(src) {
      const obj = {};
      let lines = src.toString();
      lines = lines.replace(/\r\n?/mg, "\n");
      let match;
      while ((match = LINE.exec(lines)) != null) {
        const key = match[1];
        let value = match[2] || "";
        value = value.trim();
        const maybeQuote = value[0];
        value = value.replace(/^(['"`])([\s\S]*)\1$/mg, "$2");
        if (maybeQuote === '"') {
          value = value.replace(/\\n/g, "\n");
          value = value.replace(/\\r/g, "\r");
        }
        obj[key] = value;
      }
      return obj;
    }
    function _parseVault(options) {
      const vaultPath = _vaultPath(options);
      const result = DotenvModule.configDotenv({ path: vaultPath });
      if (!result.parsed) {
        throw new Error(`MISSING_DATA: Cannot parse ${vaultPath} for an unknown reason`);
      }
      const keys = _dotenvKey(options).split(",");
      const length = keys.length;
      let decrypted;
      for (let i5 = 0; i5 < length; i5++) {
        try {
          const key = keys[i5].trim();
          const attrs = _instructions(result, key);
          decrypted = DotenvModule.decrypt(attrs.ciphertext, attrs.key);
          break;
        } catch (error) {
          if (i5 + 1 >= length) {
            throw error;
          }
        }
      }
      return DotenvModule.parse(decrypted);
    }
    function _log(message) {
      console.log(`[dotenv@${version}][INFO] ${message}`);
    }
    function _warn(message) {
      console.log(`[dotenv@${version}][WARN] ${message}`);
    }
    function _debug(message) {
      console.log(`[dotenv@${version}][DEBUG] ${message}`);
    }
    function _dotenvKey(options) {
      if (options && options.DOTENV_KEY && options.DOTENV_KEY.length > 0) {
        return options.DOTENV_KEY;
      }
      if (process.env.DOTENV_KEY && process.env.DOTENV_KEY.length > 0) {
        return process.env.DOTENV_KEY;
      }
      return "";
    }
    function _instructions(result, dotenvKey) {
      let uri;
      try {
        uri = new URL(dotenvKey);
      } catch (error) {
        if (error.code === "ERR_INVALID_URL") {
          throw new Error("INVALID_DOTENV_KEY: Wrong format. Must be in valid uri format like dotenv://:key_1234@dotenv.org/vault/.env.vault?environment=development");
        }
        throw error;
      }
      const key = uri.password;
      if (!key) {
        throw new Error("INVALID_DOTENV_KEY: Missing key part");
      }
      const environment = uri.searchParams.get("environment");
      if (!environment) {
        throw new Error("INVALID_DOTENV_KEY: Missing environment part");
      }
      const environmentKey = `DOTENV_VAULT_${environment.toUpperCase()}`;
      const ciphertext = result.parsed[environmentKey];
      if (!ciphertext) {
        throw new Error(`NOT_FOUND_DOTENV_ENVIRONMENT: Cannot locate environment ${environmentKey} in your .env.vault file.`);
      }
      return { ciphertext, key };
    }
    function _vaultPath(options) {
      let dotenvPath = path.resolve(process.cwd(), ".env");
      if (options && options.path && options.path.length > 0) {
        dotenvPath = options.path;
      }
      return dotenvPath.endsWith(".vault") ? dotenvPath : `${dotenvPath}.vault`;
    }
    function _resolveHome(envPath) {
      return envPath[0] === "~" ? path.join(os.homedir(), envPath.slice(1)) : envPath;
    }
    function _configVault(options) {
      _log("Loading env from encrypted .env.vault");
      const parsed = DotenvModule._parseVault(options);
      let processEnv = process.env;
      if (options && options.processEnv != null) {
        processEnv = options.processEnv;
      }
      DotenvModule.populate(processEnv, parsed, options);
      return { parsed };
    }
    function configDotenv(options) {
      let dotenvPath = path.resolve(process.cwd(), ".env");
      let encoding = "utf8";
      const debug = Boolean(options && options.debug);
      if (options) {
        if (options.path != null) {
          dotenvPath = _resolveHome(options.path);
        }
        if (options.encoding != null) {
          encoding = options.encoding;
        }
      }
      try {
        const parsed = DotenvModule.parse(fs.readFileSync(dotenvPath, { encoding }));
        let processEnv = process.env;
        if (options && options.processEnv != null) {
          processEnv = options.processEnv;
        }
        DotenvModule.populate(processEnv, parsed, options);
        return { parsed };
      } catch (e5) {
        if (debug) {
          _debug(`Failed to load ${dotenvPath} ${e5.message}`);
        }
        return { error: e5 };
      }
    }
    function config(options) {
      const vaultPath = _vaultPath(options);
      if (_dotenvKey(options).length === 0) {
        return DotenvModule.configDotenv(options);
      }
      if (!fs.existsSync(vaultPath)) {
        _warn(`You set DOTENV_KEY but you are missing a .env.vault file at ${vaultPath}. Did you forget to build it?`);
        return DotenvModule.configDotenv(options);
      }
      return DotenvModule._configVault(options);
    }
    function decrypt(encrypted, keyStr) {
      const key = Buffer.from(keyStr.slice(-64), "hex");
      let ciphertext = Buffer.from(encrypted, "base64");
      const nonce = ciphertext.slice(0, 12);
      const authTag = ciphertext.slice(-16);
      ciphertext = ciphertext.slice(12, -16);
      try {
        const aesgcm = crypto2.createDecipheriv("aes-256-gcm", key, nonce);
        aesgcm.setAuthTag(authTag);
        return `${aesgcm.update(ciphertext)}${aesgcm.final()}`;
      } catch (error) {
        const isRange = error instanceof RangeError;
        const invalidKeyLength = error.message === "Invalid key length";
        const decryptionFailed = error.message === "Unsupported state or unable to authenticate data";
        if (isRange || invalidKeyLength) {
          const msg = "INVALID_DOTENV_KEY: It must be 64 characters long (or more)";
          throw new Error(msg);
        } else if (decryptionFailed) {
          const msg = "DECRYPTION_FAILED: Please check your DOTENV_KEY";
          throw new Error(msg);
        } else {
          console.error("Error: ", error.code);
          console.error("Error: ", error.message);
          throw error;
        }
      }
    }
    function populate(processEnv, parsed, options = {}) {
      const debug = Boolean(options && options.debug);
      const override = Boolean(options && options.override);
      if (typeof parsed !== "object") {
        throw new Error("OBJECT_REQUIRED: Please check the processEnv argument being passed to populate");
      }
      for (const key of Object.keys(parsed)) {
        if (Object.prototype.hasOwnProperty.call(processEnv, key)) {
          if (override === true) {
            processEnv[key] = parsed[key];
          }
          if (debug) {
            if (override === true) {
              _debug(`"${key}" is already defined and WAS overwritten`);
            } else {
              _debug(`"${key}" is already defined and was NOT overwritten`);
            }
          }
        } else {
          processEnv[key] = parsed[key];
        }
      }
    }
    var DotenvModule = {
      configDotenv,
      _configVault,
      _parseVault,
      config,
      decrypt,
      parse: parse3,
      populate
    };
    module2.exports.configDotenv = DotenvModule.configDotenv;
    module2.exports._configVault = DotenvModule._configVault;
    module2.exports._parseVault = DotenvModule._parseVault;
    module2.exports.config = DotenvModule.config;
    module2.exports.decrypt = DotenvModule.decrypt;
    module2.exports.parse = DotenvModule.parse;
    module2.exports.populate = DotenvModule.populate;
    module2.exports = DotenvModule;
  }
});

// node_modules/.pnpm/dotenv@16.3.1/node_modules/dotenv/lib/env-options.js
var require_env_options = __commonJS({
  "node_modules/.pnpm/dotenv@16.3.1/node_modules/dotenv/lib/env-options.js"(exports, module2) {
    "use strict";
    var options = {};
    if (process.env.DOTENV_CONFIG_ENCODING != null) {
      options.encoding = process.env.DOTENV_CONFIG_ENCODING;
    }
    if (process.env.DOTENV_CONFIG_PATH != null) {
      options.path = process.env.DOTENV_CONFIG_PATH;
    }
    if (process.env.DOTENV_CONFIG_DEBUG != null) {
      options.debug = process.env.DOTENV_CONFIG_DEBUG;
    }
    if (process.env.DOTENV_CONFIG_OVERRIDE != null) {
      options.override = process.env.DOTENV_CONFIG_OVERRIDE;
    }
    if (process.env.DOTENV_CONFIG_DOTENV_KEY != null) {
      options.DOTENV_KEY = process.env.DOTENV_CONFIG_DOTENV_KEY;
    }
    module2.exports = options;
  }
});

// node_modules/.pnpm/dotenv@16.3.1/node_modules/dotenv/lib/cli-options.js
var require_cli_options = __commonJS({
  "node_modules/.pnpm/dotenv@16.3.1/node_modules/dotenv/lib/cli-options.js"(exports, module2) {
    "use strict";
    var re = /^dotenv_config_(encoding|path|debug|override|DOTENV_KEY)=(.+)$/;
    module2.exports = function optionMatcher(args) {
      return args.reduce(function(acc, cur) {
        const matches = cur.match(re);
        if (matches) {
          acc[matches[1]] = matches[2];
        }
        return acc;
      }, {});
    };
  }
});

// node_modules/.pnpm/@anthonylzq+node-webcam@2.2.0/node_modules/@anthonylzq/node-webcam/dist/utils/camera.js
var require_camera = __commonJS({
  "node_modules/.pnpm/@anthonylzq+node-webcam@2.2.0/node_modules/@anthonylzq/node-webcam/dist/utils/camera.js"(exports) {
    "use strict";
    var __importDefault2 = exports && exports.__importDefault || function(mod) {
      return mod && mod.__esModule ? mod : { "default": mod };
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.getCameras = exports.getLinuxCameras = void 0;
    var os_1 = __importDefault2(require("os"));
    var fs_1 = __importDefault2(require("fs"));
    var getLinuxCameras = () => {
      const req = /^video/i;
      const dir = "/dev/";
      const result = fs_1.default.readdirSync(dir);
      const cameras = result.reduce((acc, d5) => {
        if (d5.match(req))
          acc.push(dir + d5);
        return acc;
      }, []);
      return cameras;
    };
    exports.getLinuxCameras = getLinuxCameras;
    var getCameras = () => {
      switch (os_1.default.platform()) {
        case "linux":
        case "darwin":
          return getLinuxCameras();
      }
    };
    exports.getCameras = getCameras;
  }
});

// node_modules/.pnpm/@anthonylzq+node-webcam@2.2.0/node_modules/@anthonylzq/node-webcam/dist/utils/helpers.js
var require_helpers = __commonJS({
  "node_modules/.pnpm/@anthonylzq+node-webcam@2.2.0/node_modules/@anthonylzq/node-webcam/dist/utils/helpers.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.defaults = exports.setDefaults = void 0;
    var defaults = {
      width: 1280,
      height: 720,
      quality: 100,
      delay: 0,
      title: "",
      subtitle: "",
      timestamp: "",
      saveShots: true,
      output: "jpeg",
      device: "",
      verbose: false,
      frames: 1,
      greyScale: false,
      rotation: 0,
      bottomBanner: false,
      topBanner: false,
      skip: 0
    };
    exports.defaults = defaults;
    var setDefaults = (options = {}) => {
      return Object.assign(Object.assign({}, defaults), options);
    };
    exports.setDefaults = setDefaults;
  }
});

// node_modules/.pnpm/@anthonylzq+node-webcam@2.2.0/node_modules/@anthonylzq/node-webcam/dist/utils/Shot.js
var require_Shot = __commonJS({
  "node_modules/.pnpm/@anthonylzq+node-webcam@2.2.0/node_modules/@anthonylzq/node-webcam/dist/utils/Shot.js"(exports) {
    "use strict";
    var __classPrivateFieldSet2 = exports && exports.__classPrivateFieldSet || function(receiver, state, value, kind, f5) {
      if (kind === "m")
        throw new TypeError("Private method is not writable");
      if (kind === "a" && !f5)
        throw new TypeError("Private accessor was defined without a setter");
      if (typeof state === "function" ? receiver !== state || !f5 : !state.has(receiver))
        throw new TypeError("Cannot write private member to an object whose class did not declare it");
      return kind === "a" ? f5.call(receiver, value) : f5 ? f5.value = value : state.set(receiver, value), value;
    };
    var __classPrivateFieldGet2 = exports && exports.__classPrivateFieldGet || function(receiver, state, kind, f5) {
      if (kind === "a" && !f5)
        throw new TypeError("Private accessor was defined without a getter");
      if (typeof state === "function" ? receiver !== state || !f5 : !state.has(receiver))
        throw new TypeError("Cannot read private member from an object whose class did not declare it");
      return kind === "m" ? f5 : kind === "a" ? f5.call(receiver) : f5 ? f5.value : state.get(receiver);
    };
    var _Shot_location;
    var _Shot_data;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Shot = void 0;
    var Shot = class {
      constructor(location, data) {
        _Shot_location.set(this, void 0);
        _Shot_data.set(this, void 0);
        __classPrivateFieldSet2(this, _Shot_location, location, "f");
        __classPrivateFieldSet2(this, _Shot_data, data, "f");
      }
      get location() {
        return __classPrivateFieldGet2(this, _Shot_location, "f");
      }
      get data() {
        return Buffer.from(__classPrivateFieldGet2(this, _Shot_data, "f"));
      }
    };
    exports.Shot = Shot;
    _Shot_location = /* @__PURE__ */ new WeakMap(), _Shot_data = /* @__PURE__ */ new WeakMap();
  }
});

// node_modules/.pnpm/@anthonylzq+node-webcam@2.2.0/node_modules/@anthonylzq/node-webcam/dist/utils/index.js
var require_utils = __commonJS({
  "node_modules/.pnpm/@anthonylzq+node-webcam@2.2.0/node_modules/@anthonylzq/node-webcam/dist/utils/index.js"(exports) {
    "use strict";
    var __createBinding2 = exports && exports.__createBinding || (Object.create ? function(o5, m5, k5, k22) {
      if (k22 === void 0)
        k22 = k5;
      var desc = Object.getOwnPropertyDescriptor(m5, k5);
      if (!desc || ("get" in desc ? !m5.__esModule : desc.writable || desc.configurable)) {
        desc = { enumerable: true, get: function() {
          return m5[k5];
        } };
      }
      Object.defineProperty(o5, k22, desc);
    } : function(o5, m5, k5, k22) {
      if (k22 === void 0)
        k22 = k5;
      o5[k22] = m5[k5];
    });
    var __exportStar2 = exports && exports.__exportStar || function(m5, exports2) {
      for (var p5 in m5)
        if (p5 !== "default" && !Object.prototype.hasOwnProperty.call(exports2, p5))
          __createBinding2(exports2, m5, p5);
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    __exportStar2(require_camera(), exports);
    __exportStar2(require_helpers(), exports);
    __exportStar2(require_Shot(), exports);
  }
});

// node_modules/.pnpm/@anthonylzq+node-webcam@2.2.0/node_modules/@anthonylzq/node-webcam/dist/webcams/BaseWebcam.js
var require_BaseWebcam = __commonJS({
  "node_modules/.pnpm/@anthonylzq+node-webcam@2.2.0/node_modules/@anthonylzq/node-webcam/dist/webcams/BaseWebcam.js"(exports) {
    "use strict";
    var __awaiter2 = exports && exports.__awaiter || function(thisArg, _arguments, P2, generator) {
      function adopt(value) {
        return value instanceof P2 ? value : new P2(function(resolve2) {
          resolve2(value);
        });
      }
      return new (P2 || (P2 = Promise))(function(resolve2, reject) {
        function fulfilled(value) {
          try {
            step(generator.next(value));
          } catch (e5) {
            reject(e5);
          }
        }
        function rejected(value) {
          try {
            step(generator["throw"](value));
          } catch (e5) {
            reject(e5);
          }
        }
        function step(result) {
          result.done ? resolve2(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
    };
    var __classPrivateFieldSet2 = exports && exports.__classPrivateFieldSet || function(receiver, state, value, kind, f5) {
      if (kind === "m")
        throw new TypeError("Private method is not writable");
      if (kind === "a" && !f5)
        throw new TypeError("Private accessor was defined without a setter");
      if (typeof state === "function" ? receiver !== state || !f5 : !state.has(receiver))
        throw new TypeError("Cannot write private member to an object whose class did not declare it");
      return kind === "a" ? f5.call(receiver, value) : f5 ? f5.value = value : state.set(receiver, value), value;
    };
    var __classPrivateFieldGet2 = exports && exports.__classPrivateFieldGet || function(receiver, state, kind, f5) {
      if (kind === "a" && !f5)
        throw new TypeError("Private accessor was defined without a getter");
      if (typeof state === "function" ? receiver !== state || !f5 : !state.has(receiver))
        throw new TypeError("Cannot read private member from an object whose class did not declare it");
      return kind === "m" ? f5 : kind === "a" ? f5.call(receiver) : f5 ? f5.value : state.get(receiver);
    };
    var _BaseWebcam_shots;
    var _BaseWebcam_options;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.BaseWebcam = void 0;
    var child_process_1 = require("child_process");
    var util_1 = require("util");
    var fs_1 = require("fs");
    var utils_1 = require_utils();
    var asyncExec = (0, util_1.promisify)(child_process_1.exec);
    var r5 = /(?<=\.)[^.]*$/;
    var ALLOWED_FILE_TYPES = ["jpg", "jpeg", "png", "bmp"];
    var BaseWebcam = class _BaseWebcam {
      constructor(options) {
        _BaseWebcam_shots.set(this, void 0);
        _BaseWebcam_options.set(this, void 0);
        __classPrivateFieldSet2(this, _BaseWebcam_shots, [], "f");
        __classPrivateFieldSet2(this, _BaseWebcam_options, (0, utils_1.setDefaults)(options), "f");
      }
      get options() {
        return Object.assign({}, __classPrivateFieldGet2(this, _BaseWebcam_options, "f"));
      }
      setMaxQuality() {
        __classPrivateFieldGet2(this, _BaseWebcam_options, "f").quality = 9;
      }
      setMaxDelay() {
        __classPrivateFieldGet2(this, _BaseWebcam_options, "f").delay = 1;
      }
      setDelayInMilliseconds() {
        __classPrivateFieldGet2(this, _BaseWebcam_options, "f").delay = __classPrivateFieldGet2(this, _BaseWebcam_options, "f").delay * 1e3;
      }
      clone() {
        return new _BaseWebcam(__classPrivateFieldGet2(this, _BaseWebcam_options, "f"));
      }
      clear() {
        __classPrivateFieldSet2(this, _BaseWebcam_shots, [], "f");
      }
      list() {
        return (0, utils_1.getCameras)();
      }
      hasCamera(camera) {
        var _a, _b;
        return (_b = (_a = this.list()) === null || _a === void 0 ? void 0 : _a.includes(camera)) !== null && _b !== void 0 ? _b : false;
      }
      getListControlsSh(bin) {
        const devSwitch = typeof __classPrivateFieldGet2(this, _BaseWebcam_options, "f").device === "string" && __classPrivateFieldGet2(this, _BaseWebcam_options, "f").device ? `--device=${__classPrivateFieldGet2(this, _BaseWebcam_options, "f").device.trim()}` : "";
        return `${bin} ${devSwitch} --list-controls`;
      }
      createShot(location, data) {
        return new utils_1.Shot(location, data);
      }
      capture(sh, path, returnType) {
        return __awaiter2(this, void 0, void 0, function* () {
          const match = path.match(r5);
          if (!match)
            throw new Error("Invalid path, missing type file");
          if (!match[0])
            throw new Error(`Invalid type extension: ${match[0]}`);
          if (!ALLOWED_FILE_TYPES.includes(match[0]))
            throw new Error(`Invalid file extension: ${match[0]}`);
          if (__classPrivateFieldGet2(this, _BaseWebcam_options, "f").output !== match[0])
            throw new Error(`The output (${__classPrivateFieldGet2(this, _BaseWebcam_options, "f").output}) and the file type (${match[0]}) does not match`);
          try {
            yield asyncExec(sh, { maxBuffer: 1024 * 1e4 });
            const buffer = (0, fs_1.readFileSync)(path);
            switch (returnType) {
              case "buffer":
                return buffer;
              case "base64":
                return this.getBase64FromBuffer(buffer);
              default:
                throw new Error(`Invalid returnType: ${returnType}`);
            }
          } catch (error) {
            if (__classPrivateFieldGet2(this, _BaseWebcam_options, "f").verbose)
              console.error("Error while shotting: ", error);
            throw error;
          }
        });
      }
      getShot(index) {
        if (index < 0 || index > __classPrivateFieldGet2(this, _BaseWebcam_shots, "f").length)
          throw new Error("Index out of bonds");
        return __classPrivateFieldGet2(this, _BaseWebcam_shots, "f")[index];
      }
      getLastShot() {
        return __classPrivateFieldGet2(this, _BaseWebcam_shots, "f")[__classPrivateFieldGet2(this, _BaseWebcam_shots, "f").length - 1];
      }
      getShotBuffer(index) {
        const shot = this.getShot(index);
        return (0, fs_1.readFileSync)(shot.location);
      }
      getLastShotBuffer() {
        const shot = this.getLastShot();
        return (0, fs_1.readFileSync)(shot.location);
      }
      getBase64FromBuffer(shotBuffer) {
        return `data:image/${__classPrivateFieldGet2(this, _BaseWebcam_options, "f").output};base64,${shotBuffer.toString("base64")}`;
      }
      getBase64(index) {
        const shot = this.getShot(index);
        return this.getBase64FromBuffer(shot.data);
      }
      getLastShotBase64() {
        const shot = this.getLastShot();
        return this.getBase64FromBuffer(shot.data);
      }
    };
    exports.BaseWebcam = BaseWebcam;
    _BaseWebcam_shots = /* @__PURE__ */ new WeakMap(), _BaseWebcam_options = /* @__PURE__ */ new WeakMap();
  }
});

// node_modules/.pnpm/@anthonylzq+node-webcam@2.2.0/node_modules/@anthonylzq/node-webcam/dist/webcams/FSWebcam.js
var require_FSWebcam = __commonJS({
  "node_modules/.pnpm/@anthonylzq+node-webcam@2.2.0/node_modules/@anthonylzq/node-webcam/dist/webcams/FSWebcam.js"(exports) {
    "use strict";
    var __classPrivateFieldSet2 = exports && exports.__classPrivateFieldSet || function(receiver, state, value, kind, f5) {
      if (kind === "m")
        throw new TypeError("Private method is not writable");
      if (kind === "a" && !f5)
        throw new TypeError("Private accessor was defined without a setter");
      if (typeof state === "function" ? receiver !== state || !f5 : !state.has(receiver))
        throw new TypeError("Cannot write private member to an object whose class did not declare it");
      return kind === "a" ? f5.call(receiver, value) : f5 ? f5.value = value : state.set(receiver, value), value;
    };
    var __classPrivateFieldGet2 = exports && exports.__classPrivateFieldGet || function(receiver, state, kind, f5) {
      if (kind === "a" && !f5)
        throw new TypeError("Private accessor was defined without a getter");
      if (typeof state === "function" ? receiver !== state || !f5 : !state.has(receiver))
        throw new TypeError("Cannot read private member from an object whose class did not declare it");
      return kind === "m" ? f5 : kind === "a" ? f5.call(receiver) : f5 ? f5.value : state.get(receiver);
    };
    var _FSWebcam_bin;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.FSWebcam = void 0;
    var BaseWebcam_1 = require_BaseWebcam();
    var FSWebcam = class extends BaseWebcam_1.BaseWebcam {
      constructor(options) {
        super(options);
        _FSWebcam_bin.set(this, void 0);
        __classPrivateFieldSet2(this, _FSWebcam_bin, "fswebcam", "f");
        if ((options === null || options === void 0 ? void 0 : options.quality) && options.quality > 9)
          this.setMaxQuality();
      }
      generateSh(location) {
        const options = super.options;
        const resolution = ` -r ${options.width}x${options.height}`;
        const frames = `-F ${options.frames}`;
        const delay = `-D ${options.delay}`;
        const output = options.output === "jpg" ? "" : `--${options.output} -1`;
        const title = options.title ? `--title ${options.title}` : "";
        const subtitle = options.subtitle ? `--subtitle ${options.subtitle}` : "";
        const timestamp = options.timestamp ? `--timestamp ${options.timestamp}` : "";
        const device = options.device ? `-d ${options.device}` : "";
        const grey = options.greyScale ? "--greyscale" : "";
        const rotation = options.rotation ? `--rotate ${options.rotation}` : "";
        const banner = !options.topBanner && !options.bottomBanner ? "--no-banner" : options.topBanner ? "--top-banner" : "--bottom-banner";
        const skip = options.skip ? `--skip ${options.skip}` : "";
        const verbose = options.verbose ? "" : " -q";
        const shellLocation = location || "- -";
        return `${__classPrivateFieldGet2(this, _FSWebcam_bin, "f")} ${verbose} ${resolution} ${frames} ${delay} ${title} ${subtitle} ${timestamp} ${device} ${grey} ${rotation} ${banner} ${skip} ${output} ${shellLocation}`.replace(/ +/g, " ");
      }
      getListControlsSh() {
        const { options: { device } } = this;
        const devSwitch = device ? " --device=" + device.trim() : "";
        return `${__classPrivateFieldGet2(this, _FSWebcam_bin, "f")} ${devSwitch} --list-controls`;
      }
    };
    exports.FSWebcam = FSWebcam;
    _FSWebcam_bin = /* @__PURE__ */ new WeakMap();
  }
});

// node_modules/.pnpm/@anthonylzq+node-webcam@2.2.0/node_modules/@anthonylzq/node-webcam/dist/webcams/ImageSnapWebcam.js
var require_ImageSnapWebcam = __commonJS({
  "node_modules/.pnpm/@anthonylzq+node-webcam@2.2.0/node_modules/@anthonylzq/node-webcam/dist/webcams/ImageSnapWebcam.js"(exports) {
    "use strict";
    var __awaiter2 = exports && exports.__awaiter || function(thisArg, _arguments, P2, generator) {
      function adopt(value) {
        return value instanceof P2 ? value : new P2(function(resolve2) {
          resolve2(value);
        });
      }
      return new (P2 || (P2 = Promise))(function(resolve2, reject) {
        function fulfilled(value) {
          try {
            step(generator.next(value));
          } catch (e5) {
            reject(e5);
          }
        }
        function rejected(value) {
          try {
            step(generator["throw"](value));
          } catch (e5) {
            reject(e5);
          }
        }
        function step(result) {
          result.done ? resolve2(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
    };
    var __classPrivateFieldSet2 = exports && exports.__classPrivateFieldSet || function(receiver, state, value, kind, f5) {
      if (kind === "m")
        throw new TypeError("Private method is not writable");
      if (kind === "a" && !f5)
        throw new TypeError("Private accessor was defined without a setter");
      if (typeof state === "function" ? receiver !== state || !f5 : !state.has(receiver))
        throw new TypeError("Cannot write private member to an object whose class did not declare it");
      return kind === "a" ? f5.call(receiver, value) : f5 ? f5.value = value : state.set(receiver, value), value;
    };
    var __classPrivateFieldGet2 = exports && exports.__classPrivateFieldGet || function(receiver, state, kind, f5) {
      if (kind === "a" && !f5)
        throw new TypeError("Private accessor was defined without a getter");
      if (typeof state === "function" ? receiver !== state || !f5 : !state.has(receiver))
        throw new TypeError("Cannot read private member from an object whose class did not declare it");
      return kind === "m" ? f5 : kind === "a" ? f5.call(receiver) : f5 ? f5.value : state.get(receiver);
    };
    var _ImageSnapWebcam_bin;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ImageSnapWebcam = void 0;
    var child_process_1 = require("child_process");
    var util_1 = require("util");
    var BaseWebcam_1 = require_BaseWebcam();
    var asyncExec = (0, util_1.promisify)(child_process_1.exec);
    var ImageSnapWebcam = class extends BaseWebcam_1.BaseWebcam {
      constructor(options) {
        super(options);
        _ImageSnapWebcam_bin.set(this, void 0);
        __classPrivateFieldSet2(this, _ImageSnapWebcam_bin, "imagesnap", "f");
        if ((options === null || options === void 0 ? void 0 : options.delay) && (options === null || options === void 0 ? void 0 : options.delay) < 1)
          super.setMaxDelay();
      }
      generateSh(location) {
        const { options } = this;
        const verbose = options.verbose ? "-v" : "-q";
        const delay = options.delay ? `-w ${options.delay}` : "";
        const device = options.device ? `-d "${options.device}"` : "";
        return `${__classPrivateFieldGet2(this, _ImageSnapWebcam_bin, "f")} ${delay} ${device} ${verbose} ${location}`.replace(/ +/g, " ");
      }
      listWebcams() {
        return __awaiter2(this, void 0, void 0, function* () {
          const sh = `${__classPrivateFieldGet2(this, _ImageSnapWebcam_bin, "f")} -l`;
          const result = yield asyncExec(sh);
          if (result.stderr) {
            if (this.options.verbose)
              console.error("Error while listing webcams: ", result.stderr);
            throw new Error(result.stderr);
          }
          const lines = result.stdout.split("\n");
          return lines.reduce((acc, line) => {
            if (line === "Video Devices:" || !line)
              return acc;
            acc.push(line.replace(/.*?\[(.*?)\].*/, "$1"));
            return acc;
          }, []);
        });
      }
    };
    exports.ImageSnapWebcam = ImageSnapWebcam;
    _ImageSnapWebcam_bin = /* @__PURE__ */ new WeakMap();
  }
});

// node_modules/.pnpm/@anthonylzq+node-webcam@2.2.0/node_modules/@anthonylzq/node-webcam/dist/webcams/WindowsWebcam.js
var require_WindowsWebcam = __commonJS({
  "node_modules/.pnpm/@anthonylzq+node-webcam@2.2.0/node_modules/@anthonylzq/node-webcam/dist/webcams/WindowsWebcam.js"(exports) {
    "use strict";
    var __awaiter2 = exports && exports.__awaiter || function(thisArg, _arguments, P2, generator) {
      function adopt(value) {
        return value instanceof P2 ? value : new P2(function(resolve2) {
          resolve2(value);
        });
      }
      return new (P2 || (P2 = Promise))(function(resolve2, reject) {
        function fulfilled(value) {
          try {
            step(generator.next(value));
          } catch (e5) {
            reject(e5);
          }
        }
        function rejected(value) {
          try {
            step(generator["throw"](value));
          } catch (e5) {
            reject(e5);
          }
        }
        function step(result) {
          result.done ? resolve2(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
    };
    var __classPrivateFieldSet2 = exports && exports.__classPrivateFieldSet || function(receiver, state, value, kind, f5) {
      if (kind === "m")
        throw new TypeError("Private method is not writable");
      if (kind === "a" && !f5)
        throw new TypeError("Private accessor was defined without a setter");
      if (typeof state === "function" ? receiver !== state || !f5 : !state.has(receiver))
        throw new TypeError("Cannot write private member to an object whose class did not declare it");
      return kind === "a" ? f5.call(receiver, value) : f5 ? f5.value = value : state.set(receiver, value), value;
    };
    var __classPrivateFieldGet2 = exports && exports.__classPrivateFieldGet || function(receiver, state, kind, f5) {
      if (kind === "a" && !f5)
        throw new TypeError("Private accessor was defined without a getter");
      if (typeof state === "function" ? receiver !== state || !f5 : !state.has(receiver))
        throw new TypeError("Cannot read private member from an object whose class did not declare it");
      return kind === "m" ? f5 : kind === "a" ? f5.call(receiver) : f5 ? f5.value : state.get(receiver);
    };
    var _WindowsWebcam_bin;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.WindowsWebcam = void 0;
    var child_process_1 = require("child_process");
    var util_1 = require("util");
    var path_1 = require("path");
    var BaseWebcam_1 = require_BaseWebcam();
    var asyncExec = (0, util_1.promisify)(child_process_1.exec);
    var WindowsWebcam = class extends BaseWebcam_1.BaseWebcam {
      constructor(options) {
        super(Object.assign(Object.assign({}, options), { output: "bmp" }));
        _WindowsWebcam_bin.set(this, void 0);
        __classPrivateFieldSet2(this, _WindowsWebcam_bin, (0, path_1.resolve)(__dirname, "..", "bindings", "CommandCam", "CommandCam.exe"), "f");
        if (options === null || options === void 0 ? void 0 : options.delay)
          super.setDelayInMilliseconds();
      }
      generateSh(location) {
        const { options } = this;
        const device = options.device ? `/devnum ${options.device}` : "";
        const delay = options.delay ? `/delay ${options.delay}` : "";
        return `${__classPrivateFieldGet2(this, _WindowsWebcam_bin, "f")} ${delay} ${device} /filename ${location}`.replace(/ +/g, " ");
      }
      listWebcams() {
        return __awaiter2(this, void 0, void 0, function* () {
          const sh = `${__classPrivateFieldGet2(this, _WindowsWebcam_bin, "f")} /devlist`;
          const result = yield asyncExec(sh);
          if (result.stderr) {
            if (this.options.verbose)
              console.error("Error while listing webcams: ", result.stderr);
            throw new Error(result.stderr);
          }
          const lines = result.stdout.split("\n");
          return lines.reduce((acc, line) => {
            const formattedLine = line.replace("\r", "");
            if (["Available capture devices:", "Available capture devices:"].includes(formattedLine) || !formattedLine)
              return acc;
            acc.push(formattedLine);
            return acc;
          }, []);
        });
      }
    };
    exports.WindowsWebcam = WindowsWebcam;
    _WindowsWebcam_bin = /* @__PURE__ */ new WeakMap();
  }
});

// node_modules/.pnpm/@anthonylzq+node-webcam@2.2.0/node_modules/@anthonylzq/node-webcam/dist/webcams/index.js
var require_webcams = __commonJS({
  "node_modules/.pnpm/@anthonylzq+node-webcam@2.2.0/node_modules/@anthonylzq/node-webcam/dist/webcams/index.js"(exports) {
    "use strict";
    var __createBinding2 = exports && exports.__createBinding || (Object.create ? function(o5, m5, k5, k22) {
      if (k22 === void 0)
        k22 = k5;
      var desc = Object.getOwnPropertyDescriptor(m5, k5);
      if (!desc || ("get" in desc ? !m5.__esModule : desc.writable || desc.configurable)) {
        desc = { enumerable: true, get: function() {
          return m5[k5];
        } };
      }
      Object.defineProperty(o5, k22, desc);
    } : function(o5, m5, k5, k22) {
      if (k22 === void 0)
        k22 = k5;
      o5[k22] = m5[k5];
    });
    var __exportStar2 = exports && exports.__exportStar || function(m5, exports2) {
      for (var p5 in m5)
        if (p5 !== "default" && !Object.prototype.hasOwnProperty.call(exports2, p5))
          __createBinding2(exports2, m5, p5);
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    __exportStar2(require_BaseWebcam(), exports);
    __exportStar2(require_FSWebcam(), exports);
    __exportStar2(require_ImageSnapWebcam(), exports);
    __exportStar2(require_WindowsWebcam(), exports);
  }
});

// node_modules/.pnpm/@anthonylzq+node-webcam@2.2.0/node_modules/@anthonylzq/node-webcam/dist/Factory.js
var require_Factory = __commonJS({
  "node_modules/.pnpm/@anthonylzq+node-webcam@2.2.0/node_modules/@anthonylzq/node-webcam/dist/Factory.js"(exports) {
    "use strict";
    var __classPrivateFieldSet2 = exports && exports.__classPrivateFieldSet || function(receiver, state, value, kind, f5) {
      if (kind === "m")
        throw new TypeError("Private method is not writable");
      if (kind === "a" && !f5)
        throw new TypeError("Private accessor was defined without a setter");
      if (typeof state === "function" ? receiver !== state || !f5 : !state.has(receiver))
        throw new TypeError("Cannot write private member to an object whose class did not declare it");
      return kind === "a" ? f5.call(receiver, value) : f5 ? f5.value = value : state.set(receiver, value), value;
    };
    var __classPrivateFieldGet2 = exports && exports.__classPrivateFieldGet || function(receiver, state, kind, f5) {
      if (kind === "a" && !f5)
        throw new TypeError("Private accessor was defined without a getter");
      if (typeof state === "function" ? receiver !== state || !f5 : !state.has(receiver))
        throw new TypeError("Cannot read private member from an object whose class did not declare it");
      return kind === "m" ? f5 : kind === "a" ? f5.call(receiver) : f5 ? f5.value : state.get(receiver);
    };
    var _Factory_platform;
    var _Factory_types;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Factory = void 0;
    var os_1 = require("os");
    var webcams_1 = require_webcams();
    var Factory = class {
      constructor(options) {
        _Factory_platform.set(this, void 0);
        _Factory_types.set(this, void 0);
        __classPrivateFieldSet2(this, _Factory_platform, (0, os_1.platform)(), "f");
        __classPrivateFieldSet2(this, _Factory_types, {
          linux: new webcams_1.FSWebcam(options),
          fswebcam: new webcams_1.FSWebcam(options),
          darwin: new webcams_1.ImageSnapWebcam(options),
          win32: new webcams_1.WindowsWebcam(options),
          win64: new webcams_1.WindowsWebcam(options)
        }, "f");
      }
      create(type) {
        if (!Object.keys(__classPrivateFieldGet2(this, _Factory_types, "f")).includes(type))
          throw new Error("Webcam type is not supported");
        const p5 = type || __classPrivateFieldGet2(this, _Factory_platform, "f");
        return __classPrivateFieldGet2(this, _Factory_types, "f")[p5];
      }
    };
    exports.Factory = Factory;
    _Factory_platform = /* @__PURE__ */ new WeakMap(), _Factory_types = /* @__PURE__ */ new WeakMap();
  }
});

// node_modules/.pnpm/@anthonylzq+node-webcam@2.2.0/node_modules/@anthonylzq/node-webcam/dist/index.js
var require_dist = __commonJS({
  "node_modules/.pnpm/@anthonylzq+node-webcam@2.2.0/node_modules/@anthonylzq/node-webcam/dist/index.js"(exports) {
    "use strict";
    var __awaiter2 = exports && exports.__awaiter || function(thisArg, _arguments, P2, generator) {
      function adopt(value) {
        return value instanceof P2 ? value : new P2(function(resolve2) {
          resolve2(value);
        });
      }
      return new (P2 || (P2 = Promise))(function(resolve2, reject) {
        function fulfilled(value) {
          try {
            step(generator.next(value));
          } catch (e5) {
            reject(e5);
          }
        }
        function rejected(value) {
          try {
            step(generator["throw"](value));
          } catch (e5) {
            reject(e5);
          }
        }
        function step(result) {
          result.done ? resolve2(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.defaults = exports.WindowsWebcam = exports.ImageSnapWebcam = exports.FSWebcam = exports.BaseWebcam = exports.Factory = exports.list = exports.capture = exports.create = void 0;
    var path_1 = require("path");
    var Factory_1 = require_Factory();
    Object.defineProperty(exports, "Factory", { enumerable: true, get: function() {
      return Factory_1.Factory;
    } });
    var webcams_1 = require_webcams();
    Object.defineProperty(exports, "BaseWebcam", { enumerable: true, get: function() {
      return webcams_1.BaseWebcam;
    } });
    Object.defineProperty(exports, "FSWebcam", { enumerable: true, get: function() {
      return webcams_1.FSWebcam;
    } });
    Object.defineProperty(exports, "ImageSnapWebcam", { enumerable: true, get: function() {
      return webcams_1.ImageSnapWebcam;
    } });
    Object.defineProperty(exports, "WindowsWebcam", { enumerable: true, get: function() {
      return webcams_1.WindowsWebcam;
    } });
    var create = (options, type) => new Factory_1.Factory(options).create(type);
    exports.create = create;
    var capture2 = ({ location = "location.jpeg", type = "linux", options = {}, cb = (value) => {
    }, returnType = "base64" } = {
      location: "location.jpeg",
      type: "linux",
      options: {},
      cb: (value) => {
      },
      returnType: "base64"
    }) => __awaiter2(void 0, void 0, void 0, function* () {
      const Webcam = create(options, type);
      const path = (0, path_1.resolve)(__dirname, location);
      const result = yield Webcam.capture(Webcam.generateSh(location), path, returnType);
      cb === null || cb === void 0 ? void 0 : cb(result);
      return result;
    });
    exports.capture = capture2;
    var list = (type) => create({}, type).list();
    exports.list = list;
    var utils_1 = require_utils();
    Object.defineProperty(exports, "defaults", { enumerable: true, get: function() {
      return utils_1.defaults;
    } });
  }
});

// node_modules/.pnpm/tslib@1.14.1/node_modules/tslib/tslib.es6.js
var tslib_es6_exports = {};
__export(tslib_es6_exports, {
  __assign: () => __assign,
  __asyncDelegator: () => __asyncDelegator,
  __asyncGenerator: () => __asyncGenerator,
  __asyncValues: () => __asyncValues,
  __await: () => __await,
  __awaiter: () => __awaiter,
  __classPrivateFieldGet: () => __classPrivateFieldGet,
  __classPrivateFieldSet: () => __classPrivateFieldSet,
  __createBinding: () => __createBinding,
  __decorate: () => __decorate,
  __exportStar: () => __exportStar,
  __extends: () => __extends,
  __generator: () => __generator,
  __importDefault: () => __importDefault,
  __importStar: () => __importStar,
  __makeTemplateObject: () => __makeTemplateObject,
  __metadata: () => __metadata,
  __param: () => __param,
  __read: () => __read,
  __rest: () => __rest,
  __spread: () => __spread,
  __spreadArrays: () => __spreadArrays,
  __values: () => __values
});
function __extends(d5, b5) {
  extendStatics(d5, b5);
  function __() {
    this.constructor = d5;
  }
  d5.prototype = b5 === null ? Object.create(b5) : (__.prototype = b5.prototype, new __());
}
function __rest(s5, e5) {
  var t4 = {};
  for (var p5 in s5)
    if (Object.prototype.hasOwnProperty.call(s5, p5) && e5.indexOf(p5) < 0)
      t4[p5] = s5[p5];
  if (s5 != null && typeof Object.getOwnPropertySymbols === "function")
    for (var i5 = 0, p5 = Object.getOwnPropertySymbols(s5); i5 < p5.length; i5++) {
      if (e5.indexOf(p5[i5]) < 0 && Object.prototype.propertyIsEnumerable.call(s5, p5[i5]))
        t4[p5[i5]] = s5[p5[i5]];
    }
  return t4;
}
function __decorate(decorators, target, key, desc) {
  var c5 = arguments.length, r5 = c5 < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d5;
  if (typeof Reflect === "object" && typeof Reflect.decorate === "function")
    r5 = Reflect.decorate(decorators, target, key, desc);
  else
    for (var i5 = decorators.length - 1; i5 >= 0; i5--)
      if (d5 = decorators[i5])
        r5 = (c5 < 3 ? d5(r5) : c5 > 3 ? d5(target, key, r5) : d5(target, key)) || r5;
  return c5 > 3 && r5 && Object.defineProperty(target, key, r5), r5;
}
function __param(paramIndex, decorator) {
  return function(target, key) {
    decorator(target, key, paramIndex);
  };
}
function __metadata(metadataKey, metadataValue) {
  if (typeof Reflect === "object" && typeof Reflect.metadata === "function")
    return Reflect.metadata(metadataKey, metadataValue);
}
function __awaiter(thisArg, _arguments, P2, generator) {
  function adopt(value) {
    return value instanceof P2 ? value : new P2(function(resolve2) {
      resolve2(value);
    });
  }
  return new (P2 || (P2 = Promise))(function(resolve2, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e5) {
        reject(e5);
      }
    }
    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e5) {
        reject(e5);
      }
    }
    function step(result) {
      result.done ? resolve2(result.value) : adopt(result.value).then(fulfilled, rejected);
    }
    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
}
function __generator(thisArg, body) {
  var _ = { label: 0, sent: function() {
    if (t4[0] & 1)
      throw t4[1];
    return t4[1];
  }, trys: [], ops: [] }, f5, y3, t4, g5;
  return g5 = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g5[Symbol.iterator] = function() {
    return this;
  }), g5;
  function verb(n5) {
    return function(v3) {
      return step([n5, v3]);
    };
  }
  function step(op) {
    if (f5)
      throw new TypeError("Generator is already executing.");
    while (_)
      try {
        if (f5 = 1, y3 && (t4 = op[0] & 2 ? y3["return"] : op[0] ? y3["throw"] || ((t4 = y3["return"]) && t4.call(y3), 0) : y3.next) && !(t4 = t4.call(y3, op[1])).done)
          return t4;
        if (y3 = 0, t4)
          op = [op[0] & 2, t4.value];
        switch (op[0]) {
          case 0:
          case 1:
            t4 = op;
            break;
          case 4:
            _.label++;
            return { value: op[1], done: false };
          case 5:
            _.label++;
            y3 = op[1];
            op = [0];
            continue;
          case 7:
            op = _.ops.pop();
            _.trys.pop();
            continue;
          default:
            if (!(t4 = _.trys, t4 = t4.length > 0 && t4[t4.length - 1]) && (op[0] === 6 || op[0] === 2)) {
              _ = 0;
              continue;
            }
            if (op[0] === 3 && (!t4 || op[1] > t4[0] && op[1] < t4[3])) {
              _.label = op[1];
              break;
            }
            if (op[0] === 6 && _.label < t4[1]) {
              _.label = t4[1];
              t4 = op;
              break;
            }
            if (t4 && _.label < t4[2]) {
              _.label = t4[2];
              _.ops.push(op);
              break;
            }
            if (t4[2])
              _.ops.pop();
            _.trys.pop();
            continue;
        }
        op = body.call(thisArg, _);
      } catch (e5) {
        op = [6, e5];
        y3 = 0;
      } finally {
        f5 = t4 = 0;
      }
    if (op[0] & 5)
      throw op[1];
    return { value: op[0] ? op[1] : void 0, done: true };
  }
}
function __createBinding(o5, m5, k5, k22) {
  if (k22 === void 0)
    k22 = k5;
  o5[k22] = m5[k5];
}
function __exportStar(m5, exports) {
  for (var p5 in m5)
    if (p5 !== "default" && !exports.hasOwnProperty(p5))
      exports[p5] = m5[p5];
}
function __values(o5) {
  var s5 = typeof Symbol === "function" && Symbol.iterator, m5 = s5 && o5[s5], i5 = 0;
  if (m5)
    return m5.call(o5);
  if (o5 && typeof o5.length === "number")
    return {
      next: function() {
        if (o5 && i5 >= o5.length)
          o5 = void 0;
        return { value: o5 && o5[i5++], done: !o5 };
      }
    };
  throw new TypeError(s5 ? "Object is not iterable." : "Symbol.iterator is not defined.");
}
function __read(o5, n5) {
  var m5 = typeof Symbol === "function" && o5[Symbol.iterator];
  if (!m5)
    return o5;
  var i5 = m5.call(o5), r5, ar2 = [], e5;
  try {
    while ((n5 === void 0 || n5-- > 0) && !(r5 = i5.next()).done)
      ar2.push(r5.value);
  } catch (error) {
    e5 = { error };
  } finally {
    try {
      if (r5 && !r5.done && (m5 = i5["return"]))
        m5.call(i5);
    } finally {
      if (e5)
        throw e5.error;
    }
  }
  return ar2;
}
function __spread() {
  for (var ar2 = [], i5 = 0; i5 < arguments.length; i5++)
    ar2 = ar2.concat(__read(arguments[i5]));
  return ar2;
}
function __spreadArrays() {
  for (var s5 = 0, i5 = 0, il = arguments.length; i5 < il; i5++)
    s5 += arguments[i5].length;
  for (var r5 = Array(s5), k5 = 0, i5 = 0; i5 < il; i5++)
    for (var a5 = arguments[i5], j5 = 0, jl = a5.length; j5 < jl; j5++, k5++)
      r5[k5] = a5[j5];
  return r5;
}
function __await(v3) {
  return this instanceof __await ? (this.v = v3, this) : new __await(v3);
}
function __asyncGenerator(thisArg, _arguments, generator) {
  if (!Symbol.asyncIterator)
    throw new TypeError("Symbol.asyncIterator is not defined.");
  var g5 = generator.apply(thisArg, _arguments || []), i5, q5 = [];
  return i5 = {}, verb("next"), verb("throw"), verb("return"), i5[Symbol.asyncIterator] = function() {
    return this;
  }, i5;
  function verb(n5) {
    if (g5[n5])
      i5[n5] = function(v3) {
        return new Promise(function(a5, b5) {
          q5.push([n5, v3, a5, b5]) > 1 || resume(n5, v3);
        });
      };
  }
  function resume(n5, v3) {
    try {
      step(g5[n5](v3));
    } catch (e5) {
      settle(q5[0][3], e5);
    }
  }
  function step(r5) {
    r5.value instanceof __await ? Promise.resolve(r5.value.v).then(fulfill, reject) : settle(q5[0][2], r5);
  }
  function fulfill(value) {
    resume("next", value);
  }
  function reject(value) {
    resume("throw", value);
  }
  function settle(f5, v3) {
    if (f5(v3), q5.shift(), q5.length)
      resume(q5[0][0], q5[0][1]);
  }
}
function __asyncDelegator(o5) {
  var i5, p5;
  return i5 = {}, verb("next"), verb("throw", function(e5) {
    throw e5;
  }), verb("return"), i5[Symbol.iterator] = function() {
    return this;
  }, i5;
  function verb(n5, f5) {
    i5[n5] = o5[n5] ? function(v3) {
      return (p5 = !p5) ? { value: __await(o5[n5](v3)), done: n5 === "return" } : f5 ? f5(v3) : v3;
    } : f5;
  }
}
function __asyncValues(o5) {
  if (!Symbol.asyncIterator)
    throw new TypeError("Symbol.asyncIterator is not defined.");
  var m5 = o5[Symbol.asyncIterator], i5;
  return m5 ? m5.call(o5) : (o5 = typeof __values === "function" ? __values(o5) : o5[Symbol.iterator](), i5 = {}, verb("next"), verb("throw"), verb("return"), i5[Symbol.asyncIterator] = function() {
    return this;
  }, i5);
  function verb(n5) {
    i5[n5] = o5[n5] && function(v3) {
      return new Promise(function(resolve2, reject) {
        v3 = o5[n5](v3), settle(resolve2, reject, v3.done, v3.value);
      });
    };
  }
  function settle(resolve2, reject, d5, v3) {
    Promise.resolve(v3).then(function(v5) {
      resolve2({ value: v5, done: d5 });
    }, reject);
  }
}
function __makeTemplateObject(cooked, raw) {
  if (Object.defineProperty) {
    Object.defineProperty(cooked, "raw", { value: raw });
  } else {
    cooked.raw = raw;
  }
  return cooked;
}
function __importStar(mod) {
  if (mod && mod.__esModule)
    return mod;
  var result = {};
  if (mod != null) {
    for (var k5 in mod)
      if (Object.hasOwnProperty.call(mod, k5))
        result[k5] = mod[k5];
  }
  result.default = mod;
  return result;
}
function __importDefault(mod) {
  return mod && mod.__esModule ? mod : { default: mod };
}
function __classPrivateFieldGet(receiver, privateMap) {
  if (!privateMap.has(receiver)) {
    throw new TypeError("attempted to get private field on non-instance");
  }
  return privateMap.get(receiver);
}
function __classPrivateFieldSet(receiver, privateMap, value) {
  if (!privateMap.has(receiver)) {
    throw new TypeError("attempted to set private field on non-instance");
  }
  privateMap.set(receiver, value);
  return value;
}
var extendStatics, __assign;
var init_tslib_es6 = __esm({
  "node_modules/.pnpm/tslib@1.14.1/node_modules/tslib/tslib.es6.js"() {
    "use strict";
    extendStatics = function(d5, b5) {
      extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(d6, b6) {
        d6.__proto__ = b6;
      } || function(d6, b6) {
        for (var p5 in b6)
          if (b6.hasOwnProperty(p5))
            d6[p5] = b6[p5];
      };
      return extendStatics(d5, b5);
    };
    __assign = function() {
      __assign = Object.assign || function __assign2(t4) {
        for (var s5, i5 = 1, n5 = arguments.length; i5 < n5; i5++) {
          s5 = arguments[i5];
          for (var p5 in s5)
            if (Object.prototype.hasOwnProperty.call(s5, p5))
              t4[p5] = s5[p5];
        }
        return t4;
      };
      return __assign.apply(this, arguments);
    };
  }
});

// node_modules/.pnpm/@aws-sdk+util-utf8-browser@3.259.0/node_modules/@aws-sdk/util-utf8-browser/dist-es/pureJs.js
var fromUtf8, toUtf8;
var init_pureJs = __esm({
  "node_modules/.pnpm/@aws-sdk+util-utf8-browser@3.259.0/node_modules/@aws-sdk/util-utf8-browser/dist-es/pureJs.js"() {
    "use strict";
    fromUtf8 = (input) => {
      const bytes = [];
      for (let i5 = 0, len = input.length; i5 < len; i5++) {
        const value = input.charCodeAt(i5);
        if (value < 128) {
          bytes.push(value);
        } else if (value < 2048) {
          bytes.push(value >> 6 | 192, value & 63 | 128);
        } else if (i5 + 1 < input.length && (value & 64512) === 55296 && (input.charCodeAt(i5 + 1) & 64512) === 56320) {
          const surrogatePair = 65536 + ((value & 1023) << 10) + (input.charCodeAt(++i5) & 1023);
          bytes.push(surrogatePair >> 18 | 240, surrogatePair >> 12 & 63 | 128, surrogatePair >> 6 & 63 | 128, surrogatePair & 63 | 128);
        } else {
          bytes.push(value >> 12 | 224, value >> 6 & 63 | 128, value & 63 | 128);
        }
      }
      return Uint8Array.from(bytes);
    };
    toUtf8 = (input) => {
      let decoded = "";
      for (let i5 = 0, len = input.length; i5 < len; i5++) {
        const byte = input[i5];
        if (byte < 128) {
          decoded += String.fromCharCode(byte);
        } else if (192 <= byte && byte < 224) {
          const nextByte = input[++i5];
          decoded += String.fromCharCode((byte & 31) << 6 | nextByte & 63);
        } else if (240 <= byte && byte < 365) {
          const surrogatePair = [byte, input[++i5], input[++i5], input[++i5]];
          const encoded = "%" + surrogatePair.map((byteValue) => byteValue.toString(16)).join("%");
          decoded += decodeURIComponent(encoded);
        } else {
          decoded += String.fromCharCode((byte & 15) << 12 | (input[++i5] & 63) << 6 | input[++i5] & 63);
        }
      }
      return decoded;
    };
  }
});

// node_modules/.pnpm/@aws-sdk+util-utf8-browser@3.259.0/node_modules/@aws-sdk/util-utf8-browser/dist-es/whatwgEncodingApi.js
function fromUtf82(input) {
  return new TextEncoder().encode(input);
}
function toUtf82(input) {
  return new TextDecoder("utf-8").decode(input);
}
var init_whatwgEncodingApi = __esm({
  "node_modules/.pnpm/@aws-sdk+util-utf8-browser@3.259.0/node_modules/@aws-sdk/util-utf8-browser/dist-es/whatwgEncodingApi.js"() {
    "use strict";
  }
});

// node_modules/.pnpm/@aws-sdk+util-utf8-browser@3.259.0/node_modules/@aws-sdk/util-utf8-browser/dist-es/index.js
var dist_es_exports = {};
__export(dist_es_exports, {
  fromUtf8: () => fromUtf83,
  toUtf8: () => toUtf83
});
var fromUtf83, toUtf83;
var init_dist_es = __esm({
  "node_modules/.pnpm/@aws-sdk+util-utf8-browser@3.259.0/node_modules/@aws-sdk/util-utf8-browser/dist-es/index.js"() {
    "use strict";
    init_pureJs();
    init_whatwgEncodingApi();
    fromUtf83 = (input) => typeof TextEncoder === "function" ? fromUtf82(input) : fromUtf8(input);
    toUtf83 = (input) => typeof TextDecoder === "function" ? toUtf82(input) : toUtf8(input);
  }
});

// node_modules/.pnpm/@aws-crypto+util@3.0.0/node_modules/@aws-crypto/util/build/convertToBuffer.js
var require_convertToBuffer = __commonJS({
  "node_modules/.pnpm/@aws-crypto+util@3.0.0/node_modules/@aws-crypto/util/build/convertToBuffer.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.convertToBuffer = void 0;
    var util_utf8_browser_1 = (init_dist_es(), __toCommonJS(dist_es_exports));
    var fromUtf85 = typeof Buffer !== "undefined" && Buffer.from ? function(input) {
      return Buffer.from(input, "utf8");
    } : util_utf8_browser_1.fromUtf8;
    function convertToBuffer(data) {
      if (data instanceof Uint8Array)
        return data;
      if (typeof data === "string") {
        return fromUtf85(data);
      }
      if (ArrayBuffer.isView(data)) {
        return new Uint8Array(data.buffer, data.byteOffset, data.byteLength / Uint8Array.BYTES_PER_ELEMENT);
      }
      return new Uint8Array(data);
    }
    exports.convertToBuffer = convertToBuffer;
  }
});

// node_modules/.pnpm/@aws-crypto+util@3.0.0/node_modules/@aws-crypto/util/build/isEmptyData.js
var require_isEmptyData = __commonJS({
  "node_modules/.pnpm/@aws-crypto+util@3.0.0/node_modules/@aws-crypto/util/build/isEmptyData.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.isEmptyData = void 0;
    function isEmptyData(data) {
      if (typeof data === "string") {
        return data.length === 0;
      }
      return data.byteLength === 0;
    }
    exports.isEmptyData = isEmptyData;
  }
});

// node_modules/.pnpm/@aws-crypto+util@3.0.0/node_modules/@aws-crypto/util/build/numToUint8.js
var require_numToUint8 = __commonJS({
  "node_modules/.pnpm/@aws-crypto+util@3.0.0/node_modules/@aws-crypto/util/build/numToUint8.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.numToUint8 = void 0;
    function numToUint8(num) {
      return new Uint8Array([
        (num & 4278190080) >> 24,
        (num & 16711680) >> 16,
        (num & 65280) >> 8,
        num & 255
      ]);
    }
    exports.numToUint8 = numToUint8;
  }
});

// node_modules/.pnpm/@aws-crypto+util@3.0.0/node_modules/@aws-crypto/util/build/uint32ArrayFrom.js
var require_uint32ArrayFrom = __commonJS({
  "node_modules/.pnpm/@aws-crypto+util@3.0.0/node_modules/@aws-crypto/util/build/uint32ArrayFrom.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.uint32ArrayFrom = void 0;
    function uint32ArrayFrom(a_lookUpTable) {
      if (!Uint32Array.from) {
        var return_array = new Uint32Array(a_lookUpTable.length);
        var a_index = 0;
        while (a_index < a_lookUpTable.length) {
          return_array[a_index] = a_lookUpTable[a_index];
          a_index += 1;
        }
        return return_array;
      }
      return Uint32Array.from(a_lookUpTable);
    }
    exports.uint32ArrayFrom = uint32ArrayFrom;
  }
});

// node_modules/.pnpm/@aws-crypto+util@3.0.0/node_modules/@aws-crypto/util/build/index.js
var require_build = __commonJS({
  "node_modules/.pnpm/@aws-crypto+util@3.0.0/node_modules/@aws-crypto/util/build/index.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.uint32ArrayFrom = exports.numToUint8 = exports.isEmptyData = exports.convertToBuffer = void 0;
    var convertToBuffer_1 = require_convertToBuffer();
    Object.defineProperty(exports, "convertToBuffer", { enumerable: true, get: function() {
      return convertToBuffer_1.convertToBuffer;
    } });
    var isEmptyData_1 = require_isEmptyData();
    Object.defineProperty(exports, "isEmptyData", { enumerable: true, get: function() {
      return isEmptyData_1.isEmptyData;
    } });
    var numToUint8_1 = require_numToUint8();
    Object.defineProperty(exports, "numToUint8", { enumerable: true, get: function() {
      return numToUint8_1.numToUint8;
    } });
    var uint32ArrayFrom_1 = require_uint32ArrayFrom();
    Object.defineProperty(exports, "uint32ArrayFrom", { enumerable: true, get: function() {
      return uint32ArrayFrom_1.uint32ArrayFrom;
    } });
  }
});

// node_modules/.pnpm/@aws-crypto+crc32@3.0.0/node_modules/@aws-crypto/crc32/build/aws_crc32.js
var require_aws_crc32 = __commonJS({
  "node_modules/.pnpm/@aws-crypto+crc32@3.0.0/node_modules/@aws-crypto/crc32/build/aws_crc32.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.AwsCrc32 = void 0;
    var tslib_1 = (init_tslib_es6(), __toCommonJS(tslib_es6_exports));
    var util_1 = require_build();
    var index_1 = require_build2();
    var AwsCrc322 = (
      /** @class */
      function() {
        function AwsCrc323() {
          this.crc32 = new index_1.Crc32();
        }
        AwsCrc323.prototype.update = function(toHash) {
          if ((0, util_1.isEmptyData)(toHash))
            return;
          this.crc32.update((0, util_1.convertToBuffer)(toHash));
        };
        AwsCrc323.prototype.digest = function() {
          return tslib_1.__awaiter(this, void 0, void 0, function() {
            return tslib_1.__generator(this, function(_a) {
              return [2, (0, util_1.numToUint8)(this.crc32.digest())];
            });
          });
        };
        AwsCrc323.prototype.reset = function() {
          this.crc32 = new index_1.Crc32();
        };
        return AwsCrc323;
      }()
    );
    exports.AwsCrc32 = AwsCrc322;
  }
});

// node_modules/.pnpm/@aws-crypto+crc32@3.0.0/node_modules/@aws-crypto/crc32/build/index.js
var require_build2 = __commonJS({
  "node_modules/.pnpm/@aws-crypto+crc32@3.0.0/node_modules/@aws-crypto/crc32/build/index.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.AwsCrc32 = exports.Crc32 = exports.crc32 = void 0;
    var tslib_1 = (init_tslib_es6(), __toCommonJS(tslib_es6_exports));
    var util_1 = require_build();
    function crc32(data) {
      return new Crc323().update(data).digest();
    }
    exports.crc32 = crc32;
    var Crc323 = (
      /** @class */
      function() {
        function Crc324() {
          this.checksum = 4294967295;
        }
        Crc324.prototype.update = function(data) {
          var e_1, _a;
          try {
            for (var data_1 = tslib_1.__values(data), data_1_1 = data_1.next(); !data_1_1.done; data_1_1 = data_1.next()) {
              var byte = data_1_1.value;
              this.checksum = this.checksum >>> 8 ^ lookupTable[(this.checksum ^ byte) & 255];
            }
          } catch (e_1_1) {
            e_1 = { error: e_1_1 };
          } finally {
            try {
              if (data_1_1 && !data_1_1.done && (_a = data_1.return))
                _a.call(data_1);
            } finally {
              if (e_1)
                throw e_1.error;
            }
          }
          return this;
        };
        Crc324.prototype.digest = function() {
          return (this.checksum ^ 4294967295) >>> 0;
        };
        return Crc324;
      }()
    );
    exports.Crc32 = Crc323;
    var a_lookUpTable = [
      0,
      1996959894,
      3993919788,
      2567524794,
      124634137,
      1886057615,
      3915621685,
      2657392035,
      249268274,
      2044508324,
      3772115230,
      2547177864,
      162941995,
      2125561021,
      3887607047,
      2428444049,
      498536548,
      1789927666,
      4089016648,
      2227061214,
      450548861,
      1843258603,
      4107580753,
      2211677639,
      325883990,
      1684777152,
      4251122042,
      2321926636,
      335633487,
      1661365465,
      4195302755,
      2366115317,
      997073096,
      1281953886,
      3579855332,
      2724688242,
      1006888145,
      1258607687,
      3524101629,
      2768942443,
      901097722,
      1119000684,
      3686517206,
      2898065728,
      853044451,
      1172266101,
      3705015759,
      2882616665,
      651767980,
      1373503546,
      3369554304,
      3218104598,
      565507253,
      1454621731,
      3485111705,
      3099436303,
      671266974,
      1594198024,
      3322730930,
      2970347812,
      795835527,
      1483230225,
      3244367275,
      3060149565,
      1994146192,
      31158534,
      2563907772,
      4023717930,
      1907459465,
      112637215,
      2680153253,
      3904427059,
      2013776290,
      251722036,
      2517215374,
      3775830040,
      2137656763,
      141376813,
      2439277719,
      3865271297,
      1802195444,
      476864866,
      2238001368,
      4066508878,
      1812370925,
      453092731,
      2181625025,
      4111451223,
      1706088902,
      314042704,
      2344532202,
      4240017532,
      1658658271,
      366619977,
      2362670323,
      4224994405,
      1303535960,
      984961486,
      2747007092,
      3569037538,
      1256170817,
      1037604311,
      2765210733,
      3554079995,
      1131014506,
      879679996,
      2909243462,
      3663771856,
      1141124467,
      855842277,
      2852801631,
      3708648649,
      1342533948,
      654459306,
      3188396048,
      3373015174,
      1466479909,
      544179635,
      3110523913,
      3462522015,
      1591671054,
      702138776,
      2966460450,
      3352799412,
      1504918807,
      783551873,
      3082640443,
      3233442989,
      3988292384,
      2596254646,
      62317068,
      1957810842,
      3939845945,
      2647816111,
      81470997,
      1943803523,
      3814918930,
      2489596804,
      225274430,
      2053790376,
      3826175755,
      2466906013,
      167816743,
      2097651377,
      4027552580,
      2265490386,
      503444072,
      1762050814,
      4150417245,
      2154129355,
      426522225,
      1852507879,
      4275313526,
      2312317920,
      282753626,
      1742555852,
      4189708143,
      2394877945,
      397917763,
      1622183637,
      3604390888,
      2714866558,
      953729732,
      1340076626,
      3518719985,
      2797360999,
      1068828381,
      1219638859,
      3624741850,
      2936675148,
      906185462,
      1090812512,
      3747672003,
      2825379669,
      829329135,
      1181335161,
      3412177804,
      3160834842,
      628085408,
      1382605366,
      3423369109,
      3138078467,
      570562233,
      1426400815,
      3317316542,
      2998733608,
      733239954,
      1555261956,
      3268935591,
      3050360625,
      752459403,
      1541320221,
      2607071920,
      3965973030,
      1969922972,
      40735498,
      2617837225,
      3943577151,
      1913087877,
      83908371,
      2512341634,
      3803740692,
      2075208622,
      213261112,
      2463272603,
      3855990285,
      2094854071,
      198958881,
      2262029012,
      4057260610,
      1759359992,
      534414190,
      2176718541,
      4139329115,
      1873836001,
      414664567,
      2282248934,
      4279200368,
      1711684554,
      285281116,
      2405801727,
      4167216745,
      1634467795,
      376229701,
      2685067896,
      3608007406,
      1308918612,
      956543938,
      2808555105,
      3495958263,
      1231636301,
      1047427035,
      2932959818,
      3654703836,
      1088359270,
      936918e3,
      2847714899,
      3736837829,
      1202900863,
      817233897,
      3183342108,
      3401237130,
      1404277552,
      615818150,
      3134207493,
      3453421203,
      1423857449,
      601450431,
      3009837614,
      3294710456,
      1567103746,
      711928724,
      3020668471,
      3272380065,
      1510334235,
      755167117
    ];
    var lookupTable = (0, util_1.uint32ArrayFrom)(a_lookUpTable);
    var aws_crc32_1 = require_aws_crc32();
    Object.defineProperty(exports, "AwsCrc32", { enumerable: true, get: function() {
      return aws_crc32_1.AwsCrc32;
    } });
  }
});

// node_modules/.pnpm/fast-xml-parser@4.2.5/node_modules/fast-xml-parser/src/util.js
var require_util = __commonJS({
  "node_modules/.pnpm/fast-xml-parser@4.2.5/node_modules/fast-xml-parser/src/util.js"(exports) {
    "use strict";
    var nameStartChar = ":A-Za-z_\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD";
    var nameChar = nameStartChar + "\\-.\\d\\u00B7\\u0300-\\u036F\\u203F-\\u2040";
    var nameRegexp = "[" + nameStartChar + "][" + nameChar + "]*";
    var regexName = new RegExp("^" + nameRegexp + "$");
    var getAllMatches = function(string, regex) {
      const matches = [];
      let match = regex.exec(string);
      while (match) {
        const allmatches = [];
        allmatches.startIndex = regex.lastIndex - match[0].length;
        const len = match.length;
        for (let index = 0; index < len; index++) {
          allmatches.push(match[index]);
        }
        matches.push(allmatches);
        match = regex.exec(string);
      }
      return matches;
    };
    var isName = function(string) {
      const match = regexName.exec(string);
      return !(match === null || typeof match === "undefined");
    };
    exports.isExist = function(v3) {
      return typeof v3 !== "undefined";
    };
    exports.isEmptyObject = function(obj) {
      return Object.keys(obj).length === 0;
    };
    exports.merge = function(target, a5, arrayMode) {
      if (a5) {
        const keys = Object.keys(a5);
        const len = keys.length;
        for (let i5 = 0; i5 < len; i5++) {
          if (arrayMode === "strict") {
            target[keys[i5]] = [a5[keys[i5]]];
          } else {
            target[keys[i5]] = a5[keys[i5]];
          }
        }
      }
    };
    exports.getValue = function(v3) {
      if (exports.isExist(v3)) {
        return v3;
      } else {
        return "";
      }
    };
    exports.isName = isName;
    exports.getAllMatches = getAllMatches;
    exports.nameRegexp = nameRegexp;
  }
});

// node_modules/.pnpm/fast-xml-parser@4.2.5/node_modules/fast-xml-parser/src/validator.js
var require_validator = __commonJS({
  "node_modules/.pnpm/fast-xml-parser@4.2.5/node_modules/fast-xml-parser/src/validator.js"(exports) {
    "use strict";
    var util = require_util();
    var defaultOptions = {
      allowBooleanAttributes: false,
      //A tag can have attributes without any value
      unpairedTags: []
    };
    exports.validate = function(xmlData, options) {
      options = Object.assign({}, defaultOptions, options);
      const tags = [];
      let tagFound = false;
      let reachedRoot = false;
      if (xmlData[0] === "\uFEFF") {
        xmlData = xmlData.substr(1);
      }
      for (let i5 = 0; i5 < xmlData.length; i5++) {
        if (xmlData[i5] === "<" && xmlData[i5 + 1] === "?") {
          i5 += 2;
          i5 = readPI(xmlData, i5);
          if (i5.err)
            return i5;
        } else if (xmlData[i5] === "<") {
          let tagStartPos = i5;
          i5++;
          if (xmlData[i5] === "!") {
            i5 = readCommentAndCDATA(xmlData, i5);
            continue;
          } else {
            let closingTag = false;
            if (xmlData[i5] === "/") {
              closingTag = true;
              i5++;
            }
            let tagName = "";
            for (; i5 < xmlData.length && xmlData[i5] !== ">" && xmlData[i5] !== " " && xmlData[i5] !== "	" && xmlData[i5] !== "\n" && xmlData[i5] !== "\r"; i5++) {
              tagName += xmlData[i5];
            }
            tagName = tagName.trim();
            if (tagName[tagName.length - 1] === "/") {
              tagName = tagName.substring(0, tagName.length - 1);
              i5--;
            }
            if (!validateTagName(tagName)) {
              let msg;
              if (tagName.trim().length === 0) {
                msg = "Invalid space after '<'.";
              } else {
                msg = "Tag '" + tagName + "' is an invalid name.";
              }
              return getErrorObject("InvalidTag", msg, getLineNumberForPosition(xmlData, i5));
            }
            const result = readAttributeStr(xmlData, i5);
            if (result === false) {
              return getErrorObject("InvalidAttr", "Attributes for '" + tagName + "' have open quote.", getLineNumberForPosition(xmlData, i5));
            }
            let attrStr = result.value;
            i5 = result.index;
            if (attrStr[attrStr.length - 1] === "/") {
              const attrStrStart = i5 - attrStr.length;
              attrStr = attrStr.substring(0, attrStr.length - 1);
              const isValid = validateAttributeString(attrStr, options);
              if (isValid === true) {
                tagFound = true;
              } else {
                return getErrorObject(isValid.err.code, isValid.err.msg, getLineNumberForPosition(xmlData, attrStrStart + isValid.err.line));
              }
            } else if (closingTag) {
              if (!result.tagClosed) {
                return getErrorObject("InvalidTag", "Closing tag '" + tagName + "' doesn't have proper closing.", getLineNumberForPosition(xmlData, i5));
              } else if (attrStr.trim().length > 0) {
                return getErrorObject("InvalidTag", "Closing tag '" + tagName + "' can't have attributes or invalid starting.", getLineNumberForPosition(xmlData, tagStartPos));
              } else {
                const otg = tags.pop();
                if (tagName !== otg.tagName) {
                  let openPos = getLineNumberForPosition(xmlData, otg.tagStartPos);
                  return getErrorObject(
                    "InvalidTag",
                    "Expected closing tag '" + otg.tagName + "' (opened in line " + openPos.line + ", col " + openPos.col + ") instead of closing tag '" + tagName + "'.",
                    getLineNumberForPosition(xmlData, tagStartPos)
                  );
                }
                if (tags.length == 0) {
                  reachedRoot = true;
                }
              }
            } else {
              const isValid = validateAttributeString(attrStr, options);
              if (isValid !== true) {
                return getErrorObject(isValid.err.code, isValid.err.msg, getLineNumberForPosition(xmlData, i5 - attrStr.length + isValid.err.line));
              }
              if (reachedRoot === true) {
                return getErrorObject("InvalidXml", "Multiple possible root nodes found.", getLineNumberForPosition(xmlData, i5));
              } else if (options.unpairedTags.indexOf(tagName) !== -1) {
              } else {
                tags.push({ tagName, tagStartPos });
              }
              tagFound = true;
            }
            for (i5++; i5 < xmlData.length; i5++) {
              if (xmlData[i5] === "<") {
                if (xmlData[i5 + 1] === "!") {
                  i5++;
                  i5 = readCommentAndCDATA(xmlData, i5);
                  continue;
                } else if (xmlData[i5 + 1] === "?") {
                  i5 = readPI(xmlData, ++i5);
                  if (i5.err)
                    return i5;
                } else {
                  break;
                }
              } else if (xmlData[i5] === "&") {
                const afterAmp = validateAmpersand(xmlData, i5);
                if (afterAmp == -1)
                  return getErrorObject("InvalidChar", "char '&' is not expected.", getLineNumberForPosition(xmlData, i5));
                i5 = afterAmp;
              } else {
                if (reachedRoot === true && !isWhiteSpace(xmlData[i5])) {
                  return getErrorObject("InvalidXml", "Extra text at the end", getLineNumberForPosition(xmlData, i5));
                }
              }
            }
            if (xmlData[i5] === "<") {
              i5--;
            }
          }
        } else {
          if (isWhiteSpace(xmlData[i5])) {
            continue;
          }
          return getErrorObject("InvalidChar", "char '" + xmlData[i5] + "' is not expected.", getLineNumberForPosition(xmlData, i5));
        }
      }
      if (!tagFound) {
        return getErrorObject("InvalidXml", "Start tag expected.", 1);
      } else if (tags.length == 1) {
        return getErrorObject("InvalidTag", "Unclosed tag '" + tags[0].tagName + "'.", getLineNumberForPosition(xmlData, tags[0].tagStartPos));
      } else if (tags.length > 0) {
        return getErrorObject("InvalidXml", "Invalid '" + JSON.stringify(tags.map((t4) => t4.tagName), null, 4).replace(/\r?\n/g, "") + "' found.", { line: 1, col: 1 });
      }
      return true;
    };
    function isWhiteSpace(char) {
      return char === " " || char === "	" || char === "\n" || char === "\r";
    }
    function readPI(xmlData, i5) {
      const start = i5;
      for (; i5 < xmlData.length; i5++) {
        if (xmlData[i5] == "?" || xmlData[i5] == " ") {
          const tagname = xmlData.substr(start, i5 - start);
          if (i5 > 5 && tagname === "xml") {
            return getErrorObject("InvalidXml", "XML declaration allowed only at the start of the document.", getLineNumberForPosition(xmlData, i5));
          } else if (xmlData[i5] == "?" && xmlData[i5 + 1] == ">") {
            i5++;
            break;
          } else {
            continue;
          }
        }
      }
      return i5;
    }
    function readCommentAndCDATA(xmlData, i5) {
      if (xmlData.length > i5 + 5 && xmlData[i5 + 1] === "-" && xmlData[i5 + 2] === "-") {
        for (i5 += 3; i5 < xmlData.length; i5++) {
          if (xmlData[i5] === "-" && xmlData[i5 + 1] === "-" && xmlData[i5 + 2] === ">") {
            i5 += 2;
            break;
          }
        }
      } else if (xmlData.length > i5 + 8 && xmlData[i5 + 1] === "D" && xmlData[i5 + 2] === "O" && xmlData[i5 + 3] === "C" && xmlData[i5 + 4] === "T" && xmlData[i5 + 5] === "Y" && xmlData[i5 + 6] === "P" && xmlData[i5 + 7] === "E") {
        let angleBracketsCount = 1;
        for (i5 += 8; i5 < xmlData.length; i5++) {
          if (xmlData[i5] === "<") {
            angleBracketsCount++;
          } else if (xmlData[i5] === ">") {
            angleBracketsCount--;
            if (angleBracketsCount === 0) {
              break;
            }
          }
        }
      } else if (xmlData.length > i5 + 9 && xmlData[i5 + 1] === "[" && xmlData[i5 + 2] === "C" && xmlData[i5 + 3] === "D" && xmlData[i5 + 4] === "A" && xmlData[i5 + 5] === "T" && xmlData[i5 + 6] === "A" && xmlData[i5 + 7] === "[") {
        for (i5 += 8; i5 < xmlData.length; i5++) {
          if (xmlData[i5] === "]" && xmlData[i5 + 1] === "]" && xmlData[i5 + 2] === ">") {
            i5 += 2;
            break;
          }
        }
      }
      return i5;
    }
    var doubleQuote = '"';
    var singleQuote = "'";
    function readAttributeStr(xmlData, i5) {
      let attrStr = "";
      let startChar = "";
      let tagClosed = false;
      for (; i5 < xmlData.length; i5++) {
        if (xmlData[i5] === doubleQuote || xmlData[i5] === singleQuote) {
          if (startChar === "") {
            startChar = xmlData[i5];
          } else if (startChar !== xmlData[i5]) {
          } else {
            startChar = "";
          }
        } else if (xmlData[i5] === ">") {
          if (startChar === "") {
            tagClosed = true;
            break;
          }
        }
        attrStr += xmlData[i5];
      }
      if (startChar !== "") {
        return false;
      }
      return {
        value: attrStr,
        index: i5,
        tagClosed
      };
    }
    var validAttrStrRegxp = new RegExp(`(\\s*)([^\\s=]+)(\\s*=)?(\\s*(['"])(([\\s\\S])*?)\\5)?`, "g");
    function validateAttributeString(attrStr, options) {
      const matches = util.getAllMatches(attrStr, validAttrStrRegxp);
      const attrNames = {};
      for (let i5 = 0; i5 < matches.length; i5++) {
        if (matches[i5][1].length === 0) {
          return getErrorObject("InvalidAttr", "Attribute '" + matches[i5][2] + "' has no space in starting.", getPositionFromMatch(matches[i5]));
        } else if (matches[i5][3] !== void 0 && matches[i5][4] === void 0) {
          return getErrorObject("InvalidAttr", "Attribute '" + matches[i5][2] + "' is without value.", getPositionFromMatch(matches[i5]));
        } else if (matches[i5][3] === void 0 && !options.allowBooleanAttributes) {
          return getErrorObject("InvalidAttr", "boolean attribute '" + matches[i5][2] + "' is not allowed.", getPositionFromMatch(matches[i5]));
        }
        const attrName = matches[i5][2];
        if (!validateAttrName(attrName)) {
          return getErrorObject("InvalidAttr", "Attribute '" + attrName + "' is an invalid name.", getPositionFromMatch(matches[i5]));
        }
        if (!attrNames.hasOwnProperty(attrName)) {
          attrNames[attrName] = 1;
        } else {
          return getErrorObject("InvalidAttr", "Attribute '" + attrName + "' is repeated.", getPositionFromMatch(matches[i5]));
        }
      }
      return true;
    }
    function validateNumberAmpersand(xmlData, i5) {
      let re = /\d/;
      if (xmlData[i5] === "x") {
        i5++;
        re = /[\da-fA-F]/;
      }
      for (; i5 < xmlData.length; i5++) {
        if (xmlData[i5] === ";")
          return i5;
        if (!xmlData[i5].match(re))
          break;
      }
      return -1;
    }
    function validateAmpersand(xmlData, i5) {
      i5++;
      if (xmlData[i5] === ";")
        return -1;
      if (xmlData[i5] === "#") {
        i5++;
        return validateNumberAmpersand(xmlData, i5);
      }
      let count = 0;
      for (; i5 < xmlData.length; i5++, count++) {
        if (xmlData[i5].match(/\w/) && count < 20)
          continue;
        if (xmlData[i5] === ";")
          break;
        return -1;
      }
      return i5;
    }
    function getErrorObject(code, message, lineNumber) {
      return {
        err: {
          code,
          msg: message,
          line: lineNumber.line || lineNumber,
          col: lineNumber.col
        }
      };
    }
    function validateAttrName(attrName) {
      return util.isName(attrName);
    }
    function validateTagName(tagname) {
      return util.isName(tagname);
    }
    function getLineNumberForPosition(xmlData, index) {
      const lines = xmlData.substring(0, index).split(/\r?\n/);
      return {
        line: lines.length,
        // column number is last line's length + 1, because column numbering starts at 1:
        col: lines[lines.length - 1].length + 1
      };
    }
    function getPositionFromMatch(match) {
      return match.startIndex + match[1].length;
    }
  }
});

// node_modules/.pnpm/fast-xml-parser@4.2.5/node_modules/fast-xml-parser/src/xmlparser/OptionsBuilder.js
var require_OptionsBuilder = __commonJS({
  "node_modules/.pnpm/fast-xml-parser@4.2.5/node_modules/fast-xml-parser/src/xmlparser/OptionsBuilder.js"(exports) {
    "use strict";
    var defaultOptions = {
      preserveOrder: false,
      attributeNamePrefix: "@_",
      attributesGroupName: false,
      textNodeName: "#text",
      ignoreAttributes: true,
      removeNSPrefix: false,
      // remove NS from tag name or attribute name if true
      allowBooleanAttributes: false,
      //a tag can have attributes without any value
      //ignoreRootElement : false,
      parseTagValue: true,
      parseAttributeValue: false,
      trimValues: true,
      //Trim string values of tag and attributes
      cdataPropName: false,
      numberParseOptions: {
        hex: true,
        leadingZeros: true,
        eNotation: true
      },
      tagValueProcessor: function(tagName, val2) {
        return val2;
      },
      attributeValueProcessor: function(attrName, val2) {
        return val2;
      },
      stopNodes: [],
      //nested tags will not be parsed even for errors
      alwaysCreateTextNode: false,
      isArray: () => false,
      commentPropName: false,
      unpairedTags: [],
      processEntities: true,
      htmlEntities: false,
      ignoreDeclaration: false,
      ignorePiTags: false,
      transformTagName: false,
      transformAttributeName: false,
      updateTag: function(tagName, jPath, attrs) {
        return tagName;
      }
      // skipEmptyListItem: false
    };
    var buildOptions = function(options) {
      return Object.assign({}, defaultOptions, options);
    };
    exports.buildOptions = buildOptions;
    exports.defaultOptions = defaultOptions;
  }
});

// node_modules/.pnpm/fast-xml-parser@4.2.5/node_modules/fast-xml-parser/src/xmlparser/xmlNode.js
var require_xmlNode = __commonJS({
  "node_modules/.pnpm/fast-xml-parser@4.2.5/node_modules/fast-xml-parser/src/xmlparser/xmlNode.js"(exports, module2) {
    "use strict";
    var XmlNode2 = class {
      constructor(tagname) {
        this.tagname = tagname;
        this.child = [];
        this[":@"] = {};
      }
      add(key, val2) {
        if (key === "__proto__")
          key = "#__proto__";
        this.child.push({ [key]: val2 });
      }
      addChild(node) {
        if (node.tagname === "__proto__")
          node.tagname = "#__proto__";
        if (node[":@"] && Object.keys(node[":@"]).length > 0) {
          this.child.push({ [node.tagname]: node.child, [":@"]: node[":@"] });
        } else {
          this.child.push({ [node.tagname]: node.child });
        }
      }
    };
    module2.exports = XmlNode2;
  }
});

// node_modules/.pnpm/fast-xml-parser@4.2.5/node_modules/fast-xml-parser/src/xmlparser/DocTypeReader.js
var require_DocTypeReader = __commonJS({
  "node_modules/.pnpm/fast-xml-parser@4.2.5/node_modules/fast-xml-parser/src/xmlparser/DocTypeReader.js"(exports, module2) {
    "use strict";
    var util = require_util();
    function readDocType(xmlData, i5) {
      const entities = {};
      if (xmlData[i5 + 3] === "O" && xmlData[i5 + 4] === "C" && xmlData[i5 + 5] === "T" && xmlData[i5 + 6] === "Y" && xmlData[i5 + 7] === "P" && xmlData[i5 + 8] === "E") {
        i5 = i5 + 9;
        let angleBracketsCount = 1;
        let hasBody = false, comment = false;
        let exp = "";
        for (; i5 < xmlData.length; i5++) {
          if (xmlData[i5] === "<" && !comment) {
            if (hasBody && isEntity(xmlData, i5)) {
              i5 += 7;
              [entityName, val, i5] = readEntityExp(xmlData, i5 + 1);
              if (val.indexOf("&") === -1)
                entities[validateEntityName(entityName)] = {
                  regx: RegExp(`&${entityName};`, "g"),
                  val
                };
            } else if (hasBody && isElement(xmlData, i5))
              i5 += 8;
            else if (hasBody && isAttlist(xmlData, i5))
              i5 += 8;
            else if (hasBody && isNotation(xmlData, i5))
              i5 += 9;
            else if (isComment)
              comment = true;
            else
              throw new Error("Invalid DOCTYPE");
            angleBracketsCount++;
            exp = "";
          } else if (xmlData[i5] === ">") {
            if (comment) {
              if (xmlData[i5 - 1] === "-" && xmlData[i5 - 2] === "-") {
                comment = false;
                angleBracketsCount--;
              }
            } else {
              angleBracketsCount--;
            }
            if (angleBracketsCount === 0) {
              break;
            }
          } else if (xmlData[i5] === "[") {
            hasBody = true;
          } else {
            exp += xmlData[i5];
          }
        }
        if (angleBracketsCount !== 0) {
          throw new Error(`Unclosed DOCTYPE`);
        }
      } else {
        throw new Error(`Invalid Tag instead of DOCTYPE`);
      }
      return { entities, i: i5 };
    }
    function readEntityExp(xmlData, i5) {
      let entityName2 = "";
      for (; i5 < xmlData.length && (xmlData[i5] !== "'" && xmlData[i5] !== '"'); i5++) {
        entityName2 += xmlData[i5];
      }
      entityName2 = entityName2.trim();
      if (entityName2.indexOf(" ") !== -1)
        throw new Error("External entites are not supported");
      const startChar = xmlData[i5++];
      let val2 = "";
      for (; i5 < xmlData.length && xmlData[i5] !== startChar; i5++) {
        val2 += xmlData[i5];
      }
      return [entityName2, val2, i5];
    }
    function isComment(xmlData, i5) {
      if (xmlData[i5 + 1] === "!" && xmlData[i5 + 2] === "-" && xmlData[i5 + 3] === "-")
        return true;
      return false;
    }
    function isEntity(xmlData, i5) {
      if (xmlData[i5 + 1] === "!" && xmlData[i5 + 2] === "E" && xmlData[i5 + 3] === "N" && xmlData[i5 + 4] === "T" && xmlData[i5 + 5] === "I" && xmlData[i5 + 6] === "T" && xmlData[i5 + 7] === "Y")
        return true;
      return false;
    }
    function isElement(xmlData, i5) {
      if (xmlData[i5 + 1] === "!" && xmlData[i5 + 2] === "E" && xmlData[i5 + 3] === "L" && xmlData[i5 + 4] === "E" && xmlData[i5 + 5] === "M" && xmlData[i5 + 6] === "E" && xmlData[i5 + 7] === "N" && xmlData[i5 + 8] === "T")
        return true;
      return false;
    }
    function isAttlist(xmlData, i5) {
      if (xmlData[i5 + 1] === "!" && xmlData[i5 + 2] === "A" && xmlData[i5 + 3] === "T" && xmlData[i5 + 4] === "T" && xmlData[i5 + 5] === "L" && xmlData[i5 + 6] === "I" && xmlData[i5 + 7] === "S" && xmlData[i5 + 8] === "T")
        return true;
      return false;
    }
    function isNotation(xmlData, i5) {
      if (xmlData[i5 + 1] === "!" && xmlData[i5 + 2] === "N" && xmlData[i5 + 3] === "O" && xmlData[i5 + 4] === "T" && xmlData[i5 + 5] === "A" && xmlData[i5 + 6] === "T" && xmlData[i5 + 7] === "I" && xmlData[i5 + 8] === "O" && xmlData[i5 + 9] === "N")
        return true;
      return false;
    }
    function validateEntityName(name) {
      if (util.isName(name))
        return name;
      else
        throw new Error(`Invalid entity name ${name}`);
    }
    module2.exports = readDocType;
  }
});

// node_modules/.pnpm/strnum@1.0.5/node_modules/strnum/strnum.js
var require_strnum = __commonJS({
  "node_modules/.pnpm/strnum@1.0.5/node_modules/strnum/strnum.js"(exports, module2) {
    "use strict";
    var hexRegex = /^[-+]?0x[a-fA-F0-9]+$/;
    var numRegex = /^([\-\+])?(0*)(\.[0-9]+([eE]\-?[0-9]+)?|[0-9]+(\.[0-9]+([eE]\-?[0-9]+)?)?)$/;
    if (!Number.parseInt && window.parseInt) {
      Number.parseInt = window.parseInt;
    }
    if (!Number.parseFloat && window.parseFloat) {
      Number.parseFloat = window.parseFloat;
    }
    var consider = {
      hex: true,
      leadingZeros: true,
      decimalPoint: ".",
      eNotation: true
      //skipLike: /regex/
    };
    function toNumber(str, options = {}) {
      options = Object.assign({}, consider, options);
      if (!str || typeof str !== "string")
        return str;
      let trimmedStr = str.trim();
      if (options.skipLike !== void 0 && options.skipLike.test(trimmedStr))
        return str;
      else if (options.hex && hexRegex.test(trimmedStr)) {
        return Number.parseInt(trimmedStr, 16);
      } else {
        const match = numRegex.exec(trimmedStr);
        if (match) {
          const sign = match[1];
          const leadingZeros = match[2];
          let numTrimmedByZeros = trimZeros(match[3]);
          const eNotation = match[4] || match[6];
          if (!options.leadingZeros && leadingZeros.length > 0 && sign && trimmedStr[2] !== ".")
            return str;
          else if (!options.leadingZeros && leadingZeros.length > 0 && !sign && trimmedStr[1] !== ".")
            return str;
          else {
            const num = Number(trimmedStr);
            const numStr = "" + num;
            if (numStr.search(/[eE]/) !== -1) {
              if (options.eNotation)
                return num;
              else
                return str;
            } else if (eNotation) {
              if (options.eNotation)
                return num;
              else
                return str;
            } else if (trimmedStr.indexOf(".") !== -1) {
              if (numStr === "0" && numTrimmedByZeros === "")
                return num;
              else if (numStr === numTrimmedByZeros)
                return num;
              else if (sign && numStr === "-" + numTrimmedByZeros)
                return num;
              else
                return str;
            }
            if (leadingZeros) {
              if (numTrimmedByZeros === numStr)
                return num;
              else if (sign + numTrimmedByZeros === numStr)
                return num;
              else
                return str;
            }
            if (trimmedStr === numStr)
              return num;
            else if (trimmedStr === sign + numStr)
              return num;
            return str;
          }
        } else {
          return str;
        }
      }
    }
    function trimZeros(numStr) {
      if (numStr && numStr.indexOf(".") !== -1) {
        numStr = numStr.replace(/0+$/, "");
        if (numStr === ".")
          numStr = "0";
        else if (numStr[0] === ".")
          numStr = "0" + numStr;
        else if (numStr[numStr.length - 1] === ".")
          numStr = numStr.substr(0, numStr.length - 1);
        return numStr;
      }
      return numStr;
    }
    module2.exports = toNumber;
  }
});

// node_modules/.pnpm/fast-xml-parser@4.2.5/node_modules/fast-xml-parser/src/xmlparser/OrderedObjParser.js
var require_OrderedObjParser = __commonJS({
  "node_modules/.pnpm/fast-xml-parser@4.2.5/node_modules/fast-xml-parser/src/xmlparser/OrderedObjParser.js"(exports, module2) {
    "use strict";
    var util = require_util();
    var xmlNode = require_xmlNode();
    var readDocType = require_DocTypeReader();
    var toNumber = require_strnum();
    var regx = "<((!\\[CDATA\\[([\\s\\S]*?)(]]>))|((NAME:)?(NAME))([^>]*)>|((\\/)(NAME)\\s*>))([^<]*)".replace(/NAME/g, util.nameRegexp);
    var OrderedObjParser = class {
      constructor(options) {
        this.options = options;
        this.currentNode = null;
        this.tagsNodeStack = [];
        this.docTypeEntities = {};
        this.lastEntities = {
          "apos": { regex: /&(apos|#39|#x27);/g, val: "'" },
          "gt": { regex: /&(gt|#62|#x3E);/g, val: ">" },
          "lt": { regex: /&(lt|#60|#x3C);/g, val: "<" },
          "quot": { regex: /&(quot|#34|#x22);/g, val: '"' }
        };
        this.ampEntity = { regex: /&(amp|#38|#x26);/g, val: "&" };
        this.htmlEntities = {
          "space": { regex: /&(nbsp|#160);/g, val: " " },
          // "lt" : { regex: /&(lt|#60);/g, val: "<" },
          // "gt" : { regex: /&(gt|#62);/g, val: ">" },
          // "amp" : { regex: /&(amp|#38);/g, val: "&" },
          // "quot" : { regex: /&(quot|#34);/g, val: "\"" },
          // "apos" : { regex: /&(apos|#39);/g, val: "'" },
          "cent": { regex: /&(cent|#162);/g, val: "\xA2" },
          "pound": { regex: /&(pound|#163);/g, val: "\xA3" },
          "yen": { regex: /&(yen|#165);/g, val: "\xA5" },
          "euro": { regex: /&(euro|#8364);/g, val: "\u20AC" },
          "copyright": { regex: /&(copy|#169);/g, val: "\xA9" },
          "reg": { regex: /&(reg|#174);/g, val: "\xAE" },
          "inr": { regex: /&(inr|#8377);/g, val: "\u20B9" }
        };
        this.addExternalEntities = addExternalEntities;
        this.parseXml = parseXml;
        this.parseTextData = parseTextData;
        this.resolveNameSpace = resolveNameSpace;
        this.buildAttributesMap = buildAttributesMap;
        this.isItStopNode = isItStopNode;
        this.replaceEntitiesValue = replaceEntitiesValue;
        this.readStopNodeData = readStopNodeData;
        this.saveTextToParentTag = saveTextToParentTag;
        this.addChild = addChild;
      }
    };
    function addExternalEntities(externalEntities) {
      const entKeys = Object.keys(externalEntities);
      for (let i5 = 0; i5 < entKeys.length; i5++) {
        const ent = entKeys[i5];
        this.lastEntities[ent] = {
          regex: new RegExp("&" + ent + ";", "g"),
          val: externalEntities[ent]
        };
      }
    }
    function parseTextData(val2, tagName, jPath, dontTrim, hasAttributes, isLeafNode, escapeEntities) {
      if (val2 !== void 0) {
        if (this.options.trimValues && !dontTrim) {
          val2 = val2.trim();
        }
        if (val2.length > 0) {
          if (!escapeEntities)
            val2 = this.replaceEntitiesValue(val2);
          const newval = this.options.tagValueProcessor(tagName, val2, jPath, hasAttributes, isLeafNode);
          if (newval === null || newval === void 0) {
            return val2;
          } else if (typeof newval !== typeof val2 || newval !== val2) {
            return newval;
          } else if (this.options.trimValues) {
            return parseValue(val2, this.options.parseTagValue, this.options.numberParseOptions);
          } else {
            const trimmedVal = val2.trim();
            if (trimmedVal === val2) {
              return parseValue(val2, this.options.parseTagValue, this.options.numberParseOptions);
            } else {
              return val2;
            }
          }
        }
      }
    }
    function resolveNameSpace(tagname) {
      if (this.options.removeNSPrefix) {
        const tags = tagname.split(":");
        const prefix = tagname.charAt(0) === "/" ? "/" : "";
        if (tags[0] === "xmlns") {
          return "";
        }
        if (tags.length === 2) {
          tagname = prefix + tags[1];
        }
      }
      return tagname;
    }
    var attrsRegx = new RegExp(`([^\\s=]+)\\s*(=\\s*(['"])([\\s\\S]*?)\\3)?`, "gm");
    function buildAttributesMap(attrStr, jPath, tagName) {
      if (!this.options.ignoreAttributes && typeof attrStr === "string") {
        const matches = util.getAllMatches(attrStr, attrsRegx);
        const len = matches.length;
        const attrs = {};
        for (let i5 = 0; i5 < len; i5++) {
          const attrName = this.resolveNameSpace(matches[i5][1]);
          let oldVal = matches[i5][4];
          let aName = this.options.attributeNamePrefix + attrName;
          if (attrName.length) {
            if (this.options.transformAttributeName) {
              aName = this.options.transformAttributeName(aName);
            }
            if (aName === "__proto__")
              aName = "#__proto__";
            if (oldVal !== void 0) {
              if (this.options.trimValues) {
                oldVal = oldVal.trim();
              }
              oldVal = this.replaceEntitiesValue(oldVal);
              const newVal = this.options.attributeValueProcessor(attrName, oldVal, jPath);
              if (newVal === null || newVal === void 0) {
                attrs[aName] = oldVal;
              } else if (typeof newVal !== typeof oldVal || newVal !== oldVal) {
                attrs[aName] = newVal;
              } else {
                attrs[aName] = parseValue(
                  oldVal,
                  this.options.parseAttributeValue,
                  this.options.numberParseOptions
                );
              }
            } else if (this.options.allowBooleanAttributes) {
              attrs[aName] = true;
            }
          }
        }
        if (!Object.keys(attrs).length) {
          return;
        }
        if (this.options.attributesGroupName) {
          const attrCollection = {};
          attrCollection[this.options.attributesGroupName] = attrs;
          return attrCollection;
        }
        return attrs;
      }
    }
    var parseXml = function(xmlData) {
      xmlData = xmlData.replace(/\r\n?/g, "\n");
      const xmlObj = new xmlNode("!xml");
      let currentNode = xmlObj;
      let textData = "";
      let jPath = "";
      for (let i5 = 0; i5 < xmlData.length; i5++) {
        const ch = xmlData[i5];
        if (ch === "<") {
          if (xmlData[i5 + 1] === "/") {
            const closeIndex = findClosingIndex(xmlData, ">", i5, "Closing Tag is not closed.");
            let tagName = xmlData.substring(i5 + 2, closeIndex).trim();
            if (this.options.removeNSPrefix) {
              const colonIndex = tagName.indexOf(":");
              if (colonIndex !== -1) {
                tagName = tagName.substr(colonIndex + 1);
              }
            }
            if (this.options.transformTagName) {
              tagName = this.options.transformTagName(tagName);
            }
            if (currentNode) {
              textData = this.saveTextToParentTag(textData, currentNode, jPath);
            }
            const lastTagName = jPath.substring(jPath.lastIndexOf(".") + 1);
            if (tagName && this.options.unpairedTags.indexOf(tagName) !== -1) {
              throw new Error(`Unpaired tag can not be used as closing tag: </${tagName}>`);
            }
            let propIndex = 0;
            if (lastTagName && this.options.unpairedTags.indexOf(lastTagName) !== -1) {
              propIndex = jPath.lastIndexOf(".", jPath.lastIndexOf(".") - 1);
              this.tagsNodeStack.pop();
            } else {
              propIndex = jPath.lastIndexOf(".");
            }
            jPath = jPath.substring(0, propIndex);
            currentNode = this.tagsNodeStack.pop();
            textData = "";
            i5 = closeIndex;
          } else if (xmlData[i5 + 1] === "?") {
            let tagData = readTagExp(xmlData, i5, false, "?>");
            if (!tagData)
              throw new Error("Pi Tag is not closed.");
            textData = this.saveTextToParentTag(textData, currentNode, jPath);
            if (this.options.ignoreDeclaration && tagData.tagName === "?xml" || this.options.ignorePiTags) {
            } else {
              const childNode = new xmlNode(tagData.tagName);
              childNode.add(this.options.textNodeName, "");
              if (tagData.tagName !== tagData.tagExp && tagData.attrExpPresent) {
                childNode[":@"] = this.buildAttributesMap(tagData.tagExp, jPath, tagData.tagName);
              }
              this.addChild(currentNode, childNode, jPath);
            }
            i5 = tagData.closeIndex + 1;
          } else if (xmlData.substr(i5 + 1, 3) === "!--") {
            const endIndex = findClosingIndex(xmlData, "-->", i5 + 4, "Comment is not closed.");
            if (this.options.commentPropName) {
              const comment = xmlData.substring(i5 + 4, endIndex - 2);
              textData = this.saveTextToParentTag(textData, currentNode, jPath);
              currentNode.add(this.options.commentPropName, [{ [this.options.textNodeName]: comment }]);
            }
            i5 = endIndex;
          } else if (xmlData.substr(i5 + 1, 2) === "!D") {
            const result = readDocType(xmlData, i5);
            this.docTypeEntities = result.entities;
            i5 = result.i;
          } else if (xmlData.substr(i5 + 1, 2) === "![") {
            const closeIndex = findClosingIndex(xmlData, "]]>", i5, "CDATA is not closed.") - 2;
            const tagExp = xmlData.substring(i5 + 9, closeIndex);
            textData = this.saveTextToParentTag(textData, currentNode, jPath);
            if (this.options.cdataPropName) {
              currentNode.add(this.options.cdataPropName, [{ [this.options.textNodeName]: tagExp }]);
            } else {
              let val2 = this.parseTextData(tagExp, currentNode.tagname, jPath, true, false, true);
              if (val2 == void 0)
                val2 = "";
              currentNode.add(this.options.textNodeName, val2);
            }
            i5 = closeIndex + 2;
          } else {
            let result = readTagExp(xmlData, i5, this.options.removeNSPrefix);
            let tagName = result.tagName;
            let tagExp = result.tagExp;
            let attrExpPresent = result.attrExpPresent;
            let closeIndex = result.closeIndex;
            if (this.options.transformTagName) {
              tagName = this.options.transformTagName(tagName);
            }
            if (currentNode && textData) {
              if (currentNode.tagname !== "!xml") {
                textData = this.saveTextToParentTag(textData, currentNode, jPath, false);
              }
            }
            const lastTag = currentNode;
            if (lastTag && this.options.unpairedTags.indexOf(lastTag.tagname) !== -1) {
              currentNode = this.tagsNodeStack.pop();
              jPath = jPath.substring(0, jPath.lastIndexOf("."));
            }
            if (tagName !== xmlObj.tagname) {
              jPath += jPath ? "." + tagName : tagName;
            }
            if (this.isItStopNode(this.options.stopNodes, jPath, tagName)) {
              let tagContent = "";
              if (tagExp.length > 0 && tagExp.lastIndexOf("/") === tagExp.length - 1) {
                i5 = result.closeIndex;
              } else if (this.options.unpairedTags.indexOf(tagName) !== -1) {
                i5 = result.closeIndex;
              } else {
                const result2 = this.readStopNodeData(xmlData, tagName, closeIndex + 1);
                if (!result2)
                  throw new Error(`Unexpected end of ${tagName}`);
                i5 = result2.i;
                tagContent = result2.tagContent;
              }
              const childNode = new xmlNode(tagName);
              if (tagName !== tagExp && attrExpPresent) {
                childNode[":@"] = this.buildAttributesMap(tagExp, jPath, tagName);
              }
              if (tagContent) {
                tagContent = this.parseTextData(tagContent, tagName, jPath, true, attrExpPresent, true, true);
              }
              jPath = jPath.substr(0, jPath.lastIndexOf("."));
              childNode.add(this.options.textNodeName, tagContent);
              this.addChild(currentNode, childNode, jPath);
            } else {
              if (tagExp.length > 0 && tagExp.lastIndexOf("/") === tagExp.length - 1) {
                if (tagName[tagName.length - 1] === "/") {
                  tagName = tagName.substr(0, tagName.length - 1);
                  tagExp = tagName;
                } else {
                  tagExp = tagExp.substr(0, tagExp.length - 1);
                }
                if (this.options.transformTagName) {
                  tagName = this.options.transformTagName(tagName);
                }
                const childNode = new xmlNode(tagName);
                if (tagName !== tagExp && attrExpPresent) {
                  childNode[":@"] = this.buildAttributesMap(tagExp, jPath, tagName);
                }
                this.addChild(currentNode, childNode, jPath);
                jPath = jPath.substr(0, jPath.lastIndexOf("."));
              } else {
                const childNode = new xmlNode(tagName);
                this.tagsNodeStack.push(currentNode);
                if (tagName !== tagExp && attrExpPresent) {
                  childNode[":@"] = this.buildAttributesMap(tagExp, jPath, tagName);
                }
                this.addChild(currentNode, childNode, jPath);
                currentNode = childNode;
              }
              textData = "";
              i5 = closeIndex;
            }
          }
        } else {
          textData += xmlData[i5];
        }
      }
      return xmlObj.child;
    };
    function addChild(currentNode, childNode, jPath) {
      const result = this.options.updateTag(childNode.tagname, jPath, childNode[":@"]);
      if (result === false) {
      } else if (typeof result === "string") {
        childNode.tagname = result;
        currentNode.addChild(childNode);
      } else {
        currentNode.addChild(childNode);
      }
    }
    var replaceEntitiesValue = function(val2) {
      if (this.options.processEntities) {
        for (let entityName2 in this.docTypeEntities) {
          const entity = this.docTypeEntities[entityName2];
          val2 = val2.replace(entity.regx, entity.val);
        }
        for (let entityName2 in this.lastEntities) {
          const entity = this.lastEntities[entityName2];
          val2 = val2.replace(entity.regex, entity.val);
        }
        if (this.options.htmlEntities) {
          for (let entityName2 in this.htmlEntities) {
            const entity = this.htmlEntities[entityName2];
            val2 = val2.replace(entity.regex, entity.val);
          }
        }
        val2 = val2.replace(this.ampEntity.regex, this.ampEntity.val);
      }
      return val2;
    };
    function saveTextToParentTag(textData, currentNode, jPath, isLeafNode) {
      if (textData) {
        if (isLeafNode === void 0)
          isLeafNode = Object.keys(currentNode.child).length === 0;
        textData = this.parseTextData(
          textData,
          currentNode.tagname,
          jPath,
          false,
          currentNode[":@"] ? Object.keys(currentNode[":@"]).length !== 0 : false,
          isLeafNode
        );
        if (textData !== void 0 && textData !== "")
          currentNode.add(this.options.textNodeName, textData);
        textData = "";
      }
      return textData;
    }
    function isItStopNode(stopNodes, jPath, currentTagName) {
      const allNodesExp = "*." + currentTagName;
      for (const stopNodePath in stopNodes) {
        const stopNodeExp = stopNodes[stopNodePath];
        if (allNodesExp === stopNodeExp || jPath === stopNodeExp)
          return true;
      }
      return false;
    }
    function tagExpWithClosingIndex(xmlData, i5, closingChar = ">") {
      let attrBoundary;
      let tagExp = "";
      for (let index = i5; index < xmlData.length; index++) {
        let ch = xmlData[index];
        if (attrBoundary) {
          if (ch === attrBoundary)
            attrBoundary = "";
        } else if (ch === '"' || ch === "'") {
          attrBoundary = ch;
        } else if (ch === closingChar[0]) {
          if (closingChar[1]) {
            if (xmlData[index + 1] === closingChar[1]) {
              return {
                data: tagExp,
                index
              };
            }
          } else {
            return {
              data: tagExp,
              index
            };
          }
        } else if (ch === "	") {
          ch = " ";
        }
        tagExp += ch;
      }
    }
    function findClosingIndex(xmlData, str, i5, errMsg) {
      const closingIndex = xmlData.indexOf(str, i5);
      if (closingIndex === -1) {
        throw new Error(errMsg);
      } else {
        return closingIndex + str.length - 1;
      }
    }
    function readTagExp(xmlData, i5, removeNSPrefix, closingChar = ">") {
      const result = tagExpWithClosingIndex(xmlData, i5 + 1, closingChar);
      if (!result)
        return;
      let tagExp = result.data;
      const closeIndex = result.index;
      const separatorIndex = tagExp.search(/\s/);
      let tagName = tagExp;
      let attrExpPresent = true;
      if (separatorIndex !== -1) {
        tagName = tagExp.substr(0, separatorIndex).replace(/\s\s*$/, "");
        tagExp = tagExp.substr(separatorIndex + 1);
      }
      if (removeNSPrefix) {
        const colonIndex = tagName.indexOf(":");
        if (colonIndex !== -1) {
          tagName = tagName.substr(colonIndex + 1);
          attrExpPresent = tagName !== result.data.substr(colonIndex + 1);
        }
      }
      return {
        tagName,
        tagExp,
        closeIndex,
        attrExpPresent
      };
    }
    function readStopNodeData(xmlData, tagName, i5) {
      const startIndex = i5;
      let openTagCount = 1;
      for (; i5 < xmlData.length; i5++) {
        if (xmlData[i5] === "<") {
          if (xmlData[i5 + 1] === "/") {
            const closeIndex = findClosingIndex(xmlData, ">", i5, `${tagName} is not closed`);
            let closeTagName = xmlData.substring(i5 + 2, closeIndex).trim();
            if (closeTagName === tagName) {
              openTagCount--;
              if (openTagCount === 0) {
                return {
                  tagContent: xmlData.substring(startIndex, i5),
                  i: closeIndex
                };
              }
            }
            i5 = closeIndex;
          } else if (xmlData[i5 + 1] === "?") {
            const closeIndex = findClosingIndex(xmlData, "?>", i5 + 1, "StopNode is not closed.");
            i5 = closeIndex;
          } else if (xmlData.substr(i5 + 1, 3) === "!--") {
            const closeIndex = findClosingIndex(xmlData, "-->", i5 + 3, "StopNode is not closed.");
            i5 = closeIndex;
          } else if (xmlData.substr(i5 + 1, 2) === "![") {
            const closeIndex = findClosingIndex(xmlData, "]]>", i5, "StopNode is not closed.") - 2;
            i5 = closeIndex;
          } else {
            const tagData = readTagExp(xmlData, i5, ">");
            if (tagData) {
              const openTagName = tagData && tagData.tagName;
              if (openTagName === tagName && tagData.tagExp[tagData.tagExp.length - 1] !== "/") {
                openTagCount++;
              }
              i5 = tagData.closeIndex;
            }
          }
        }
      }
    }
    function parseValue(val2, shouldParse, options) {
      if (shouldParse && typeof val2 === "string") {
        const newval = val2.trim();
        if (newval === "true")
          return true;
        else if (newval === "false")
          return false;
        else
          return toNumber(val2, options);
      } else {
        if (util.isExist(val2)) {
          return val2;
        } else {
          return "";
        }
      }
    }
    module2.exports = OrderedObjParser;
  }
});

// node_modules/.pnpm/fast-xml-parser@4.2.5/node_modules/fast-xml-parser/src/xmlparser/node2json.js
var require_node2json = __commonJS({
  "node_modules/.pnpm/fast-xml-parser@4.2.5/node_modules/fast-xml-parser/src/xmlparser/node2json.js"(exports) {
    "use strict";
    function prettify(node, options) {
      return compress(node, options);
    }
    function compress(arr, options, jPath) {
      let text;
      const compressedObj = {};
      for (let i5 = 0; i5 < arr.length; i5++) {
        const tagObj = arr[i5];
        const property = propName(tagObj);
        let newJpath = "";
        if (jPath === void 0)
          newJpath = property;
        else
          newJpath = jPath + "." + property;
        if (property === options.textNodeName) {
          if (text === void 0)
            text = tagObj[property];
          else
            text += "" + tagObj[property];
        } else if (property === void 0) {
          continue;
        } else if (tagObj[property]) {
          let val2 = compress(tagObj[property], options, newJpath);
          const isLeaf = isLeafTag(val2, options);
          if (tagObj[":@"]) {
            assignAttributes(val2, tagObj[":@"], newJpath, options);
          } else if (Object.keys(val2).length === 1 && val2[options.textNodeName] !== void 0 && !options.alwaysCreateTextNode) {
            val2 = val2[options.textNodeName];
          } else if (Object.keys(val2).length === 0) {
            if (options.alwaysCreateTextNode)
              val2[options.textNodeName] = "";
            else
              val2 = "";
          }
          if (compressedObj[property] !== void 0 && compressedObj.hasOwnProperty(property)) {
            if (!Array.isArray(compressedObj[property])) {
              compressedObj[property] = [compressedObj[property]];
            }
            compressedObj[property].push(val2);
          } else {
            if (options.isArray(property, newJpath, isLeaf)) {
              compressedObj[property] = [val2];
            } else {
              compressedObj[property] = val2;
            }
          }
        }
      }
      if (typeof text === "string") {
        if (text.length > 0)
          compressedObj[options.textNodeName] = text;
      } else if (text !== void 0)
        compressedObj[options.textNodeName] = text;
      return compressedObj;
    }
    function propName(obj) {
      const keys = Object.keys(obj);
      for (let i5 = 0; i5 < keys.length; i5++) {
        const key = keys[i5];
        if (key !== ":@")
          return key;
      }
    }
    function assignAttributes(obj, attrMap, jpath, options) {
      if (attrMap) {
        const keys = Object.keys(attrMap);
        const len = keys.length;
        for (let i5 = 0; i5 < len; i5++) {
          const atrrName = keys[i5];
          if (options.isArray(atrrName, jpath + "." + atrrName, true, true)) {
            obj[atrrName] = [attrMap[atrrName]];
          } else {
            obj[atrrName] = attrMap[atrrName];
          }
        }
      }
    }
    function isLeafTag(obj, options) {
      const { textNodeName } = options;
      const propCount = Object.keys(obj).length;
      if (propCount === 0) {
        return true;
      }
      if (propCount === 1 && (obj[textNodeName] || typeof obj[textNodeName] === "boolean" || obj[textNodeName] === 0)) {
        return true;
      }
      return false;
    }
    exports.prettify = prettify;
  }
});

// node_modules/.pnpm/fast-xml-parser@4.2.5/node_modules/fast-xml-parser/src/xmlparser/XMLParser.js
var require_XMLParser = __commonJS({
  "node_modules/.pnpm/fast-xml-parser@4.2.5/node_modules/fast-xml-parser/src/xmlparser/XMLParser.js"(exports, module2) {
    "use strict";
    var { buildOptions } = require_OptionsBuilder();
    var OrderedObjParser = require_OrderedObjParser();
    var { prettify } = require_node2json();
    var validator = require_validator();
    var XMLParser3 = class {
      constructor(options) {
        this.externalEntities = {};
        this.options = buildOptions(options);
      }
      /**
       * Parse XML dats to JS object 
       * @param {string|Buffer} xmlData 
       * @param {boolean|Object} validationOption 
       */
      parse(xmlData, validationOption) {
        if (typeof xmlData === "string") {
        } else if (xmlData.toString) {
          xmlData = xmlData.toString();
        } else {
          throw new Error("XML data is accepted in String or Bytes[] form.");
        }
        if (validationOption) {
          if (validationOption === true)
            validationOption = {};
          const result = validator.validate(xmlData, validationOption);
          if (result !== true) {
            throw Error(`${result.err.msg}:${result.err.line}:${result.err.col}`);
          }
        }
        const orderedObjParser = new OrderedObjParser(this.options);
        orderedObjParser.addExternalEntities(this.externalEntities);
        const orderedResult = orderedObjParser.parseXml(xmlData);
        if (this.options.preserveOrder || orderedResult === void 0)
          return orderedResult;
        else
          return prettify(orderedResult, this.options);
      }
      /**
       * Add Entity which is not by default supported by this library
       * @param {string} key 
       * @param {string} value 
       */
      addEntity(key, value) {
        if (value.indexOf("&") !== -1) {
          throw new Error("Entity value can't have '&'");
        } else if (key.indexOf("&") !== -1 || key.indexOf(";") !== -1) {
          throw new Error("An entity must be set without '&' and ';'. Eg. use '#xD' for '&#xD;'");
        } else if (value === "&") {
          throw new Error("An entity with value '&' is not permitted");
        } else {
          this.externalEntities[key] = value;
        }
      }
    };
    module2.exports = XMLParser3;
  }
});

// node_modules/.pnpm/fast-xml-parser@4.2.5/node_modules/fast-xml-parser/src/xmlbuilder/orderedJs2Xml.js
var require_orderedJs2Xml = __commonJS({
  "node_modules/.pnpm/fast-xml-parser@4.2.5/node_modules/fast-xml-parser/src/xmlbuilder/orderedJs2Xml.js"(exports, module2) {
    "use strict";
    var EOL = "\n";
    function toXml(jArray, options) {
      let indentation = "";
      if (options.format && options.indentBy.length > 0) {
        indentation = EOL;
      }
      return arrToStr(jArray, options, "", indentation);
    }
    function arrToStr(arr, options, jPath, indentation) {
      let xmlStr = "";
      let isPreviousElementTag = false;
      for (let i5 = 0; i5 < arr.length; i5++) {
        const tagObj = arr[i5];
        const tagName = propName(tagObj);
        let newJPath = "";
        if (jPath.length === 0)
          newJPath = tagName;
        else
          newJPath = `${jPath}.${tagName}`;
        if (tagName === options.textNodeName) {
          let tagText = tagObj[tagName];
          if (!isStopNode(newJPath, options)) {
            tagText = options.tagValueProcessor(tagName, tagText);
            tagText = replaceEntitiesValue(tagText, options);
          }
          if (isPreviousElementTag) {
            xmlStr += indentation;
          }
          xmlStr += tagText;
          isPreviousElementTag = false;
          continue;
        } else if (tagName === options.cdataPropName) {
          if (isPreviousElementTag) {
            xmlStr += indentation;
          }
          xmlStr += `<![CDATA[${tagObj[tagName][0][options.textNodeName]}]]>`;
          isPreviousElementTag = false;
          continue;
        } else if (tagName === options.commentPropName) {
          xmlStr += indentation + `<!--${tagObj[tagName][0][options.textNodeName]}-->`;
          isPreviousElementTag = true;
          continue;
        } else if (tagName[0] === "?") {
          const attStr2 = attr_to_str(tagObj[":@"], options);
          const tempInd = tagName === "?xml" ? "" : indentation;
          let piTextNodeName = tagObj[tagName][0][options.textNodeName];
          piTextNodeName = piTextNodeName.length !== 0 ? " " + piTextNodeName : "";
          xmlStr += tempInd + `<${tagName}${piTextNodeName}${attStr2}?>`;
          isPreviousElementTag = true;
          continue;
        }
        let newIdentation = indentation;
        if (newIdentation !== "") {
          newIdentation += options.indentBy;
        }
        const attStr = attr_to_str(tagObj[":@"], options);
        const tagStart = indentation + `<${tagName}${attStr}`;
        const tagValue = arrToStr(tagObj[tagName], options, newJPath, newIdentation);
        if (options.unpairedTags.indexOf(tagName) !== -1) {
          if (options.suppressUnpairedNode)
            xmlStr += tagStart + ">";
          else
            xmlStr += tagStart + "/>";
        } else if ((!tagValue || tagValue.length === 0) && options.suppressEmptyNode) {
          xmlStr += tagStart + "/>";
        } else if (tagValue && tagValue.endsWith(">")) {
          xmlStr += tagStart + `>${tagValue}${indentation}</${tagName}>`;
        } else {
          xmlStr += tagStart + ">";
          if (tagValue && indentation !== "" && (tagValue.includes("/>") || tagValue.includes("</"))) {
            xmlStr += indentation + options.indentBy + tagValue + indentation;
          } else {
            xmlStr += tagValue;
          }
          xmlStr += `</${tagName}>`;
        }
        isPreviousElementTag = true;
      }
      return xmlStr;
    }
    function propName(obj) {
      const keys = Object.keys(obj);
      for (let i5 = 0; i5 < keys.length; i5++) {
        const key = keys[i5];
        if (key !== ":@")
          return key;
      }
    }
    function attr_to_str(attrMap, options) {
      let attrStr = "";
      if (attrMap && !options.ignoreAttributes) {
        for (let attr in attrMap) {
          let attrVal = options.attributeValueProcessor(attr, attrMap[attr]);
          attrVal = replaceEntitiesValue(attrVal, options);
          if (attrVal === true && options.suppressBooleanAttributes) {
            attrStr += ` ${attr.substr(options.attributeNamePrefix.length)}`;
          } else {
            attrStr += ` ${attr.substr(options.attributeNamePrefix.length)}="${attrVal}"`;
          }
        }
      }
      return attrStr;
    }
    function isStopNode(jPath, options) {
      jPath = jPath.substr(0, jPath.length - options.textNodeName.length - 1);
      let tagName = jPath.substr(jPath.lastIndexOf(".") + 1);
      for (let index in options.stopNodes) {
        if (options.stopNodes[index] === jPath || options.stopNodes[index] === "*." + tagName)
          return true;
      }
      return false;
    }
    function replaceEntitiesValue(textValue, options) {
      if (textValue && textValue.length > 0 && options.processEntities) {
        for (let i5 = 0; i5 < options.entities.length; i5++) {
          const entity = options.entities[i5];
          textValue = textValue.replace(entity.regex, entity.val);
        }
      }
      return textValue;
    }
    module2.exports = toXml;
  }
});

// node_modules/.pnpm/fast-xml-parser@4.2.5/node_modules/fast-xml-parser/src/xmlbuilder/json2xml.js
var require_json2xml = __commonJS({
  "node_modules/.pnpm/fast-xml-parser@4.2.5/node_modules/fast-xml-parser/src/xmlbuilder/json2xml.js"(exports, module2) {
    "use strict";
    var buildFromOrderedJs = require_orderedJs2Xml();
    var defaultOptions = {
      attributeNamePrefix: "@_",
      attributesGroupName: false,
      textNodeName: "#text",
      ignoreAttributes: true,
      cdataPropName: false,
      format: false,
      indentBy: "  ",
      suppressEmptyNode: false,
      suppressUnpairedNode: true,
      suppressBooleanAttributes: true,
      tagValueProcessor: function(key, a5) {
        return a5;
      },
      attributeValueProcessor: function(attrName, a5) {
        return a5;
      },
      preserveOrder: false,
      commentPropName: false,
      unpairedTags: [],
      entities: [
        { regex: new RegExp("&", "g"), val: "&amp;" },
        //it must be on top
        { regex: new RegExp(">", "g"), val: "&gt;" },
        { regex: new RegExp("<", "g"), val: "&lt;" },
        { regex: new RegExp("'", "g"), val: "&apos;" },
        { regex: new RegExp('"', "g"), val: "&quot;" }
      ],
      processEntities: true,
      stopNodes: [],
      // transformTagName: false,
      // transformAttributeName: false,
      oneListGroup: false
    };
    function Builder(options) {
      this.options = Object.assign({}, defaultOptions, options);
      if (this.options.ignoreAttributes || this.options.attributesGroupName) {
        this.isAttribute = function() {
          return false;
        };
      } else {
        this.attrPrefixLen = this.options.attributeNamePrefix.length;
        this.isAttribute = isAttribute;
      }
      this.processTextOrObjNode = processTextOrObjNode;
      if (this.options.format) {
        this.indentate = indentate;
        this.tagEndChar = ">\n";
        this.newLine = "\n";
      } else {
        this.indentate = function() {
          return "";
        };
        this.tagEndChar = ">";
        this.newLine = "";
      }
    }
    Builder.prototype.build = function(jObj) {
      if (this.options.preserveOrder) {
        return buildFromOrderedJs(jObj, this.options);
      } else {
        if (Array.isArray(jObj) && this.options.arrayNodeName && this.options.arrayNodeName.length > 1) {
          jObj = {
            [this.options.arrayNodeName]: jObj
          };
        }
        return this.j2x(jObj, 0).val;
      }
    };
    Builder.prototype.j2x = function(jObj, level) {
      let attrStr = "";
      let val2 = "";
      for (let key in jObj) {
        if (typeof jObj[key] === "undefined") {
        } else if (jObj[key] === null) {
          if (key[0] === "?")
            val2 += this.indentate(level) + "<" + key + "?" + this.tagEndChar;
          else
            val2 += this.indentate(level) + "<" + key + "/" + this.tagEndChar;
        } else if (jObj[key] instanceof Date) {
          val2 += this.buildTextValNode(jObj[key], key, "", level);
        } else if (typeof jObj[key] !== "object") {
          const attr = this.isAttribute(key);
          if (attr) {
            attrStr += this.buildAttrPairStr(attr, "" + jObj[key]);
          } else {
            if (key === this.options.textNodeName) {
              let newval = this.options.tagValueProcessor(key, "" + jObj[key]);
              val2 += this.replaceEntitiesValue(newval);
            } else {
              val2 += this.buildTextValNode(jObj[key], key, "", level);
            }
          }
        } else if (Array.isArray(jObj[key])) {
          const arrLen = jObj[key].length;
          let listTagVal = "";
          for (let j5 = 0; j5 < arrLen; j5++) {
            const item = jObj[key][j5];
            if (typeof item === "undefined") {
            } else if (item === null) {
              if (key[0] === "?")
                val2 += this.indentate(level) + "<" + key + "?" + this.tagEndChar;
              else
                val2 += this.indentate(level) + "<" + key + "/" + this.tagEndChar;
            } else if (typeof item === "object") {
              if (this.options.oneListGroup) {
                listTagVal += this.j2x(item, level + 1).val;
              } else {
                listTagVal += this.processTextOrObjNode(item, key, level);
              }
            } else {
              listTagVal += this.buildTextValNode(item, key, "", level);
            }
          }
          if (this.options.oneListGroup) {
            listTagVal = this.buildObjectNode(listTagVal, key, "", level);
          }
          val2 += listTagVal;
        } else {
          if (this.options.attributesGroupName && key === this.options.attributesGroupName) {
            const Ks = Object.keys(jObj[key]);
            const L2 = Ks.length;
            for (let j5 = 0; j5 < L2; j5++) {
              attrStr += this.buildAttrPairStr(Ks[j5], "" + jObj[key][Ks[j5]]);
            }
          } else {
            val2 += this.processTextOrObjNode(jObj[key], key, level);
          }
        }
      }
      return { attrStr, val: val2 };
    };
    Builder.prototype.buildAttrPairStr = function(attrName, val2) {
      val2 = this.options.attributeValueProcessor(attrName, "" + val2);
      val2 = this.replaceEntitiesValue(val2);
      if (this.options.suppressBooleanAttributes && val2 === "true") {
        return " " + attrName;
      } else
        return " " + attrName + '="' + val2 + '"';
    };
    function processTextOrObjNode(object, key, level) {
      const result = this.j2x(object, level + 1);
      if (object[this.options.textNodeName] !== void 0 && Object.keys(object).length === 1) {
        return this.buildTextValNode(object[this.options.textNodeName], key, result.attrStr, level);
      } else {
        return this.buildObjectNode(result.val, key, result.attrStr, level);
      }
    }
    Builder.prototype.buildObjectNode = function(val2, key, attrStr, level) {
      if (val2 === "") {
        if (key[0] === "?")
          return this.indentate(level) + "<" + key + attrStr + "?" + this.tagEndChar;
        else {
          return this.indentate(level) + "<" + key + attrStr + this.closeTag(key) + this.tagEndChar;
        }
      } else {
        let tagEndExp = "</" + key + this.tagEndChar;
        let piClosingChar = "";
        if (key[0] === "?") {
          piClosingChar = "?";
          tagEndExp = "";
        }
        if (attrStr && val2.indexOf("<") === -1) {
          return this.indentate(level) + "<" + key + attrStr + piClosingChar + ">" + val2 + tagEndExp;
        } else if (this.options.commentPropName !== false && key === this.options.commentPropName && piClosingChar.length === 0) {
          return this.indentate(level) + `<!--${val2}-->` + this.newLine;
        } else {
          return this.indentate(level) + "<" + key + attrStr + piClosingChar + this.tagEndChar + val2 + this.indentate(level) + tagEndExp;
        }
      }
    };
    Builder.prototype.closeTag = function(key) {
      let closeTag = "";
      if (this.options.unpairedTags.indexOf(key) !== -1) {
        if (!this.options.suppressUnpairedNode)
          closeTag = "/";
      } else if (this.options.suppressEmptyNode) {
        closeTag = "/";
      } else {
        closeTag = `></${key}`;
      }
      return closeTag;
    };
    Builder.prototype.buildTextValNode = function(val2, key, attrStr, level) {
      if (this.options.cdataPropName !== false && key === this.options.cdataPropName) {
        return this.indentate(level) + `<![CDATA[${val2}]]>` + this.newLine;
      } else if (this.options.commentPropName !== false && key === this.options.commentPropName) {
        return this.indentate(level) + `<!--${val2}-->` + this.newLine;
      } else if (key[0] === "?") {
        return this.indentate(level) + "<" + key + attrStr + "?" + this.tagEndChar;
      } else {
        let textValue = this.options.tagValueProcessor(key, val2);
        textValue = this.replaceEntitiesValue(textValue);
        if (textValue === "") {
          return this.indentate(level) + "<" + key + attrStr + this.closeTag(key) + this.tagEndChar;
        } else {
          return this.indentate(level) + "<" + key + attrStr + ">" + textValue + "</" + key + this.tagEndChar;
        }
      }
    };
    Builder.prototype.replaceEntitiesValue = function(textValue) {
      if (textValue && textValue.length > 0 && this.options.processEntities) {
        for (let i5 = 0; i5 < this.options.entities.length; i5++) {
          const entity = this.options.entities[i5];
          textValue = textValue.replace(entity.regex, entity.val);
        }
      }
      return textValue;
    };
    function indentate(level) {
      return this.options.indentBy.repeat(level);
    }
    function isAttribute(name) {
      if (name.startsWith(this.options.attributeNamePrefix)) {
        return name.substr(this.attrPrefixLen);
      } else {
        return false;
      }
    }
    module2.exports = Builder;
  }
});

// node_modules/.pnpm/fast-xml-parser@4.2.5/node_modules/fast-xml-parser/src/fxp.js
var require_fxp = __commonJS({
  "node_modules/.pnpm/fast-xml-parser@4.2.5/node_modules/fast-xml-parser/src/fxp.js"(exports, module2) {
    "use strict";
    var validator = require_validator();
    var XMLParser3 = require_XMLParser();
    var XMLBuilder = require_json2xml();
    module2.exports = {
      XMLParser: XMLParser3,
      XMLValidator: validator,
      XMLBuilder
    };
  }
});

// node_modules/.pnpm/@aws-crypto+crc32c@3.0.0/node_modules/@aws-crypto/crc32c/build/aws_crc32c.js
var require_aws_crc32c = __commonJS({
  "node_modules/.pnpm/@aws-crypto+crc32c@3.0.0/node_modules/@aws-crypto/crc32c/build/aws_crc32c.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.AwsCrc32c = void 0;
    var tslib_1 = (init_tslib_es6(), __toCommonJS(tslib_es6_exports));
    var util_1 = require_build();
    var index_1 = require_build3();
    var AwsCrc32c2 = (
      /** @class */
      function() {
        function AwsCrc32c3() {
          this.crc32c = new index_1.Crc32c();
        }
        AwsCrc32c3.prototype.update = function(toHash) {
          if ((0, util_1.isEmptyData)(toHash))
            return;
          this.crc32c.update((0, util_1.convertToBuffer)(toHash));
        };
        AwsCrc32c3.prototype.digest = function() {
          return tslib_1.__awaiter(this, void 0, void 0, function() {
            return tslib_1.__generator(this, function(_a) {
              return [2, (0, util_1.numToUint8)(this.crc32c.digest())];
            });
          });
        };
        AwsCrc32c3.prototype.reset = function() {
          this.crc32c = new index_1.Crc32c();
        };
        return AwsCrc32c3;
      }()
    );
    exports.AwsCrc32c = AwsCrc32c2;
  }
});

// node_modules/.pnpm/@aws-crypto+crc32c@3.0.0/node_modules/@aws-crypto/crc32c/build/index.js
var require_build3 = __commonJS({
  "node_modules/.pnpm/@aws-crypto+crc32c@3.0.0/node_modules/@aws-crypto/crc32c/build/index.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.AwsCrc32c = exports.Crc32c = exports.crc32c = void 0;
    var tslib_1 = (init_tslib_es6(), __toCommonJS(tslib_es6_exports));
    var util_1 = require_build();
    function crc32c(data) {
      return new Crc32c().update(data).digest();
    }
    exports.crc32c = crc32c;
    var Crc32c = (
      /** @class */
      function() {
        function Crc32c2() {
          this.checksum = 4294967295;
        }
        Crc32c2.prototype.update = function(data) {
          var e_1, _a;
          try {
            for (var data_1 = tslib_1.__values(data), data_1_1 = data_1.next(); !data_1_1.done; data_1_1 = data_1.next()) {
              var byte = data_1_1.value;
              this.checksum = this.checksum >>> 8 ^ lookupTable[(this.checksum ^ byte) & 255];
            }
          } catch (e_1_1) {
            e_1 = { error: e_1_1 };
          } finally {
            try {
              if (data_1_1 && !data_1_1.done && (_a = data_1.return))
                _a.call(data_1);
            } finally {
              if (e_1)
                throw e_1.error;
            }
          }
          return this;
        };
        Crc32c2.prototype.digest = function() {
          return (this.checksum ^ 4294967295) >>> 0;
        };
        return Crc32c2;
      }()
    );
    exports.Crc32c = Crc32c;
    var a_lookupTable = [
      0,
      4067132163,
      3778769143,
      324072436,
      3348797215,
      904991772,
      648144872,
      3570033899,
      2329499855,
      2024987596,
      1809983544,
      2575936315,
      1296289744,
      3207089363,
      2893594407,
      1578318884,
      274646895,
      3795141740,
      4049975192,
      51262619,
      3619967088,
      632279923,
      922689671,
      3298075524,
      2592579488,
      1760304291,
      2075979607,
      2312596564,
      1562183871,
      2943781820,
      3156637768,
      1313733451,
      549293790,
      3537243613,
      3246849577,
      871202090,
      3878099393,
      357341890,
      102525238,
      4101499445,
      2858735121,
      1477399826,
      1264559846,
      3107202533,
      1845379342,
      2677391885,
      2361733625,
      2125378298,
      820201905,
      3263744690,
      3520608582,
      598981189,
      4151959214,
      85089709,
      373468761,
      3827903834,
      3124367742,
      1213305469,
      1526817161,
      2842354314,
      2107672161,
      2412447074,
      2627466902,
      1861252501,
      1098587580,
      3004210879,
      2688576843,
      1378610760,
      2262928035,
      1955203488,
      1742404180,
      2511436119,
      3416409459,
      969524848,
      714683780,
      3639785095,
      205050476,
      4266873199,
      3976438427,
      526918040,
      1361435347,
      2739821008,
      2954799652,
      1114974503,
      2529119692,
      1691668175,
      2005155131,
      2247081528,
      3690758684,
      697762079,
      986182379,
      3366744552,
      476452099,
      3993867776,
      4250756596,
      255256311,
      1640403810,
      2477592673,
      2164122517,
      1922457750,
      2791048317,
      1412925310,
      1197962378,
      3037525897,
      3944729517,
      427051182,
      170179418,
      4165941337,
      746937522,
      3740196785,
      3451792453,
      1070968646,
      1905808397,
      2213795598,
      2426610938,
      1657317369,
      3053634322,
      1147748369,
      1463399397,
      2773627110,
      4215344322,
      153784257,
      444234805,
      3893493558,
      1021025245,
      3467647198,
      3722505002,
      797665321,
      2197175160,
      1889384571,
      1674398607,
      2443626636,
      1164749927,
      3070701412,
      2757221520,
      1446797203,
      137323447,
      4198817972,
      3910406976,
      461344835,
      3484808360,
      1037989803,
      781091935,
      3705997148,
      2460548119,
      1623424788,
      1939049696,
      2180517859,
      1429367560,
      2807687179,
      3020495871,
      1180866812,
      410100952,
      3927582683,
      4182430767,
      186734380,
      3756733383,
      763408580,
      1053836080,
      3434856499,
      2722870694,
      1344288421,
      1131464017,
      2971354706,
      1708204729,
      2545590714,
      2229949006,
      1988219213,
      680717673,
      3673779818,
      3383336350,
      1002577565,
      4010310262,
      493091189,
      238226049,
      4233660802,
      2987750089,
      1082061258,
      1395524158,
      2705686845,
      1972364758,
      2279892693,
      2494862625,
      1725896226,
      952904198,
      3399985413,
      3656866545,
      731699698,
      4283874585,
      222117402,
      510512622,
      3959836397,
      3280807620,
      837199303,
      582374963,
      3504198960,
      68661723,
      4135334616,
      3844915500,
      390545967,
      1230274059,
      3141532936,
      2825850620,
      1510247935,
      2395924756,
      2091215383,
      1878366691,
      2644384480,
      3553878443,
      565732008,
      854102364,
      3229815391,
      340358836,
      3861050807,
      4117890627,
      119113024,
      1493875044,
      2875275879,
      3090270611,
      1247431312,
      2660249211,
      1828433272,
      2141937292,
      2378227087,
      3811616794,
      291187481,
      34330861,
      4032846830,
      615137029,
      3603020806,
      3314634738,
      939183345,
      1776939221,
      2609017814,
      2295496738,
      2058945313,
      2926798794,
      1545135305,
      1330124605,
      3173225534,
      4084100981,
      17165430,
      307568514,
      3762199681,
      888469610,
      3332340585,
      3587147933,
      665062302,
      2042050490,
      2346497209,
      2559330125,
      1793573966,
      3190661285,
      1279665062,
      1595330642,
      2910671697
    ];
    var lookupTable = (0, util_1.uint32ArrayFrom)(a_lookupTable);
    var aws_crc32c_1 = require_aws_crc32c();
    Object.defineProperty(exports, "AwsCrc32c", { enumerable: true, get: function() {
      return aws_crc32c_1.AwsCrc32c;
    } });
  }
});

// node_modules/.pnpm/dotenv@16.3.1/node_modules/dotenv/config.js
(function() {
  require_main().config(
    Object.assign(
      {},
      require_env_options(),
      require_cli_options()(process.argv)
    )
  );
})();

// src/captureImage.ts
var import_os = require("os");
var import_node_webcam = __toESM(require_dist());
var import_path = require("path");
var captureImage = async () => {
  const filename = `${(/* @__PURE__ */ new Date()).toISOString()}.jpeg`;
  const location = (0, import_path.resolve)(__dirname, "../images", filename);
  const result = await (0, import_node_webcam.capture)({
    location,
    type: (0, import_os.platform)(),
    returnType: "buffer",
    options: {
      // width: 1920,
      // height: 1080,
      output: "jpeg",
      saveShots: false
    }
  });
  return { filename, location, result };
};

// node_modules/.pnpm/@smithy+types@2.3.0/node_modules/@smithy/types/dist-es/auth.js
var HttpAuthLocation;
(function(HttpAuthLocation2) {
  HttpAuthLocation2["HEADER"] = "header";
  HttpAuthLocation2["QUERY"] = "query";
})(HttpAuthLocation || (HttpAuthLocation = {}));

// node_modules/.pnpm/@smithy+types@2.3.0/node_modules/@smithy/types/dist-es/endpoint.js
var EndpointURLScheme;
(function(EndpointURLScheme2) {
  EndpointURLScheme2["HTTP"] = "http";
  EndpointURLScheme2["HTTPS"] = "https";
})(EndpointURLScheme || (EndpointURLScheme = {}));

// node_modules/.pnpm/@smithy+types@2.3.0/node_modules/@smithy/types/dist-es/extensions/checksum.js
var AlgorithmId;
(function(AlgorithmId2) {
  AlgorithmId2["MD5"] = "md5";
  AlgorithmId2["CRC32"] = "crc32";
  AlgorithmId2["CRC32C"] = "crc32c";
  AlgorithmId2["SHA1"] = "sha1";
  AlgorithmId2["SHA256"] = "sha256";
})(AlgorithmId || (AlgorithmId = {}));

// node_modules/.pnpm/@smithy+types@2.3.0/node_modules/@smithy/types/dist-es/http.js
var FieldPosition;
(function(FieldPosition2) {
  FieldPosition2[FieldPosition2["HEADER"] = 0] = "HEADER";
  FieldPosition2[FieldPosition2["TRAILER"] = 1] = "TRAILER";
})(FieldPosition || (FieldPosition = {}));

// node_modules/.pnpm/@smithy+types@2.3.0/node_modules/@smithy/types/dist-es/transfer.js
var RequestHandlerProtocol;
(function(RequestHandlerProtocol2) {
  RequestHandlerProtocol2["HTTP_0_9"] = "http/0.9";
  RequestHandlerProtocol2["HTTP_1_0"] = "http/1.0";
  RequestHandlerProtocol2["TDS_8_0"] = "tds/8.0";
})(RequestHandlerProtocol || (RequestHandlerProtocol = {}));

// node_modules/.pnpm/@smithy+protocol-http@2.0.5/node_modules/@smithy/protocol-http/dist-es/httpRequest.js
var HttpRequest = class _HttpRequest {
  constructor(options) {
    this.method = options.method || "GET";
    this.hostname = options.hostname || "localhost";
    this.port = options.port;
    this.query = options.query || {};
    this.headers = options.headers || {};
    this.body = options.body;
    this.protocol = options.protocol ? options.protocol.slice(-1) !== ":" ? `${options.protocol}:` : options.protocol : "https:";
    this.path = options.path ? options.path.charAt(0) !== "/" ? `/${options.path}` : options.path : "/";
    this.username = options.username;
    this.password = options.password;
    this.fragment = options.fragment;
  }
  static isInstance(request2) {
    if (!request2)
      return false;
    const req = request2;
    return "method" in req && "protocol" in req && "hostname" in req && "path" in req && typeof req["query"] === "object" && typeof req["headers"] === "object";
  }
  clone() {
    const cloned = new _HttpRequest({
      ...this,
      headers: { ...this.headers }
    });
    if (cloned.query)
      cloned.query = cloneQuery(cloned.query);
    return cloned;
  }
};
function cloneQuery(query) {
  return Object.keys(query).reduce((carry, paramName) => {
    const param = query[paramName];
    return {
      ...carry,
      [paramName]: Array.isArray(param) ? [...param] : param
    };
  }, {});
}

// node_modules/.pnpm/@smithy+protocol-http@2.0.5/node_modules/@smithy/protocol-http/dist-es/httpResponse.js
var HttpResponse = class {
  constructor(options) {
    this.statusCode = options.statusCode;
    this.reason = options.reason;
    this.headers = options.headers || {};
    this.body = options.body;
  }
  static isInstance(response) {
    if (!response)
      return false;
    const resp = response;
    return typeof resp.statusCode === "number" && typeof resp.headers === "object";
  }
};

// node_modules/.pnpm/@aws-sdk+middleware-expect-continue@3.408.0/node_modules/@aws-sdk/middleware-expect-continue/dist-es/index.js
function addExpectContinueMiddleware(options) {
  return (next) => async (args) => {
    const { request: request2 } = args;
    if (HttpRequest.isInstance(request2) && request2.body && options.runtime === "node") {
      request2.headers = {
        ...request2.headers,
        Expect: "100-continue"
      };
    }
    return next({
      ...args,
      request: request2
    });
  };
}
var addExpectContinueMiddlewareOptions = {
  step: "build",
  tags: ["SET_EXPECT_HEADER", "EXPECT_HEADER"],
  name: "addExpectContinueMiddleware",
  override: true
};
var getAddExpectContinuePlugin = (options) => ({
  applyToStack: (clientStack) => {
    clientStack.add(addExpectContinueMiddleware(options), addExpectContinueMiddlewareOptions);
  }
});

// node_modules/.pnpm/@aws-sdk+middleware-host-header@3.408.0/node_modules/@aws-sdk/middleware-host-header/dist-es/index.js
function resolveHostHeaderConfig(input) {
  return input;
}
var hostHeaderMiddleware = (options) => (next) => async (args) => {
  if (!HttpRequest.isInstance(args.request))
    return next(args);
  const { request: request2 } = args;
  const { handlerProtocol = "" } = options.requestHandler.metadata || {};
  if (handlerProtocol.indexOf("h2") >= 0 && !request2.headers[":authority"]) {
    delete request2.headers["host"];
    request2.headers[":authority"] = "";
  } else if (!request2.headers["host"]) {
    let host = request2.hostname;
    if (request2.port != null)
      host += `:${request2.port}`;
    request2.headers["host"] = host;
  }
  return next(args);
};
var hostHeaderMiddlewareOptions = {
  name: "hostHeaderMiddleware",
  step: "build",
  priority: "low",
  tags: ["HOST"],
  override: true
};
var getHostHeaderPlugin = (options) => ({
  applyToStack: (clientStack) => {
    clientStack.add(hostHeaderMiddleware(options), hostHeaderMiddlewareOptions);
  }
});

// node_modules/.pnpm/@aws-sdk+middleware-logger@3.408.0/node_modules/@aws-sdk/middleware-logger/dist-es/loggerMiddleware.js
var loggerMiddleware = () => (next, context) => async (args) => {
  var _a, _b;
  try {
    const response = await next(args);
    const { clientName, commandName, logger: logger2, dynamoDbDocumentClientOptions = {} } = context;
    const { overrideInputFilterSensitiveLog, overrideOutputFilterSensitiveLog } = dynamoDbDocumentClientOptions;
    const inputFilterSensitiveLog = overrideInputFilterSensitiveLog != null ? overrideInputFilterSensitiveLog : context.inputFilterSensitiveLog;
    const outputFilterSensitiveLog = overrideOutputFilterSensitiveLog != null ? overrideOutputFilterSensitiveLog : context.outputFilterSensitiveLog;
    const { $metadata, ...outputWithoutMetadata } = response.output;
    (_a = logger2 == null ? void 0 : logger2.info) == null ? void 0 : _a.call(logger2, {
      clientName,
      commandName,
      input: inputFilterSensitiveLog(args.input),
      output: outputFilterSensitiveLog(outputWithoutMetadata),
      metadata: $metadata
    });
    return response;
  } catch (error) {
    const { clientName, commandName, logger: logger2, dynamoDbDocumentClientOptions = {} } = context;
    const { overrideInputFilterSensitiveLog } = dynamoDbDocumentClientOptions;
    const inputFilterSensitiveLog = overrideInputFilterSensitiveLog != null ? overrideInputFilterSensitiveLog : context.inputFilterSensitiveLog;
    (_b = logger2 == null ? void 0 : logger2.error) == null ? void 0 : _b.call(logger2, {
      clientName,
      commandName,
      input: inputFilterSensitiveLog(args.input),
      error,
      metadata: error.$metadata
    });
    throw error;
  }
};
var loggerMiddlewareOptions = {
  name: "loggerMiddleware",
  tags: ["LOGGER"],
  step: "initialize",
  override: true
};
var getLoggerPlugin = (options) => ({
  applyToStack: (clientStack) => {
    clientStack.add(loggerMiddleware(), loggerMiddlewareOptions);
  }
});

// node_modules/.pnpm/@aws-sdk+middleware-recursion-detection@3.408.0/node_modules/@aws-sdk/middleware-recursion-detection/dist-es/index.js
var TRACE_ID_HEADER_NAME = "X-Amzn-Trace-Id";
var ENV_LAMBDA_FUNCTION_NAME = "AWS_LAMBDA_FUNCTION_NAME";
var ENV_TRACE_ID = "_X_AMZN_TRACE_ID";
var recursionDetectionMiddleware = (options) => (next) => async (args) => {
  const { request: request2 } = args;
  if (!HttpRequest.isInstance(request2) || options.runtime !== "node" || request2.headers.hasOwnProperty(TRACE_ID_HEADER_NAME)) {
    return next(args);
  }
  const functionName = process.env[ENV_LAMBDA_FUNCTION_NAME];
  const traceId = process.env[ENV_TRACE_ID];
  const nonEmptyString = (str) => typeof str === "string" && str.length > 0;
  if (nonEmptyString(functionName) && nonEmptyString(traceId)) {
    request2.headers[TRACE_ID_HEADER_NAME] = traceId;
  }
  return next({
    ...args,
    request: request2
  });
};
var addRecursionDetectionMiddlewareOptions = {
  step: "build",
  tags: ["RECURSION_DETECTION"],
  name: "recursionDetectionMiddleware",
  override: true,
  priority: "low"
};
var getRecursionDetectionPlugin = (options) => ({
  applyToStack: (clientStack) => {
    clientStack.add(recursionDetectionMiddleware(options), addRecursionDetectionMiddlewareOptions);
  }
});

// node_modules/.pnpm/@aws-sdk+middleware-sdk-s3@3.408.0/node_modules/@aws-sdk/middleware-sdk-s3/dist-es/check-content-length-header.js
var CONTENT_LENGTH_HEADER = "content-length";
function checkContentLengthHeader() {
  return (next, context) => async (args) => {
    var _a;
    const { request: request2 } = args;
    if (HttpRequest.isInstance(request2)) {
      if (!request2.headers[CONTENT_LENGTH_HEADER]) {
        const message = `Are you using a Stream of unknown length as the Body of a PutObject request? Consider using Upload instead from @aws-sdk/lib-storage.`;
        if (typeof ((_a = context == null ? void 0 : context.logger) == null ? void 0 : _a.warn) === "function") {
          context.logger.warn(message);
        } else {
          console.warn(message);
        }
      }
    }
    return next({ ...args });
  };
}
var checkContentLengthHeaderMiddlewareOptions = {
  step: "finalizeRequest",
  tags: ["CHECK_CONTENT_LENGTH_HEADER"],
  name: "getCheckContentLengthHeaderPlugin",
  override: true
};
var getCheckContentLengthHeaderPlugin = (unused) => ({
  applyToStack: (clientStack) => {
    clientStack.add(checkContentLengthHeader(), checkContentLengthHeaderMiddlewareOptions);
  }
});

// node_modules/.pnpm/@aws-sdk+middleware-sdk-s3@3.408.0/node_modules/@aws-sdk/middleware-sdk-s3/dist-es/s3Configuration.js
var resolveS3Config = (input) => {
  var _a, _b, _c;
  return {
    ...input,
    forcePathStyle: (_a = input.forcePathStyle) != null ? _a : false,
    useAccelerateEndpoint: (_b = input.useAccelerateEndpoint) != null ? _b : false,
    disableMultiregionAccessPoints: (_c = input.disableMultiregionAccessPoints) != null ? _c : false
  };
};

// node_modules/.pnpm/@aws-sdk+util-arn-parser@3.310.0/node_modules/@aws-sdk/util-arn-parser/dist-es/index.js
var validate = (str) => typeof str === "string" && str.indexOf("arn:") === 0 && str.split(":").length >= 6;

// node_modules/.pnpm/@aws-sdk+middleware-sdk-s3@3.408.0/node_modules/@aws-sdk/middleware-sdk-s3/dist-es/validate-bucket-name.js
function validateBucketNameMiddleware() {
  return (next) => async (args) => {
    const { input: { Bucket } } = args;
    if (typeof Bucket === "string" && !validate(Bucket) && Bucket.indexOf("/") >= 0) {
      const err = new Error(`Bucket name shouldn't contain '/', received '${Bucket}'`);
      err.name = "InvalidBucketName";
      throw err;
    }
    return next({ ...args });
  };
}
var validateBucketNameMiddlewareOptions = {
  step: "initialize",
  tags: ["VALIDATE_BUCKET_NAME"],
  name: "validateBucketNameMiddleware",
  override: true
};
var getValidateBucketNamePlugin = (unused) => ({
  applyToStack: (clientStack) => {
    clientStack.add(validateBucketNameMiddleware(), validateBucketNameMiddlewareOptions);
  }
});

// node_modules/.pnpm/@smithy+property-provider@2.0.7/node_modules/@smithy/property-provider/dist-es/ProviderError.js
var ProviderError = class _ProviderError extends Error {
  constructor(message, tryNextLink = true) {
    super(message);
    this.tryNextLink = tryNextLink;
    this.name = "ProviderError";
    Object.setPrototypeOf(this, _ProviderError.prototype);
  }
  static from(error, tryNextLink = true) {
    return Object.assign(new this(error.message, tryNextLink), error);
  }
};

// node_modules/.pnpm/@smithy+property-provider@2.0.7/node_modules/@smithy/property-provider/dist-es/CredentialsProviderError.js
var CredentialsProviderError = class _CredentialsProviderError extends ProviderError {
  constructor(message, tryNextLink = true) {
    super(message, tryNextLink);
    this.tryNextLink = tryNextLink;
    this.name = "CredentialsProviderError";
    Object.setPrototypeOf(this, _CredentialsProviderError.prototype);
  }
};

// node_modules/.pnpm/@smithy+property-provider@2.0.7/node_modules/@smithy/property-provider/dist-es/TokenProviderError.js
var TokenProviderError = class _TokenProviderError extends ProviderError {
  constructor(message, tryNextLink = true) {
    super(message, tryNextLink);
    this.tryNextLink = tryNextLink;
    this.name = "TokenProviderError";
    Object.setPrototypeOf(this, _TokenProviderError.prototype);
  }
};

// node_modules/.pnpm/@smithy+property-provider@2.0.7/node_modules/@smithy/property-provider/dist-es/chain.js
var chain = (...providers) => async () => {
  if (providers.length === 0) {
    throw new ProviderError("No providers in chain");
  }
  let lastProviderError;
  for (const provider of providers) {
    try {
      const credentials = await provider();
      return credentials;
    } catch (err) {
      lastProviderError = err;
      if (err == null ? void 0 : err.tryNextLink) {
        continue;
      }
      throw err;
    }
  }
  throw lastProviderError;
};

// node_modules/.pnpm/@smithy+property-provider@2.0.7/node_modules/@smithy/property-provider/dist-es/fromStatic.js
var fromStatic = (staticValue) => () => Promise.resolve(staticValue);

// node_modules/.pnpm/@smithy+property-provider@2.0.7/node_modules/@smithy/property-provider/dist-es/memoize.js
var memoize = (provider, isExpired, requiresRefresh) => {
  let resolved;
  let pending;
  let hasResult;
  let isConstant = false;
  const coalesceProvider = async () => {
    if (!pending) {
      pending = provider();
    }
    try {
      resolved = await pending;
      hasResult = true;
      isConstant = false;
    } finally {
      pending = void 0;
    }
    return resolved;
  };
  if (isExpired === void 0) {
    return async (options) => {
      if (!hasResult || (options == null ? void 0 : options.forceRefresh)) {
        resolved = await coalesceProvider();
      }
      return resolved;
    };
  }
  return async (options) => {
    if (!hasResult || (options == null ? void 0 : options.forceRefresh)) {
      resolved = await coalesceProvider();
    }
    if (isConstant) {
      return resolved;
    }
    if (requiresRefresh && !requiresRefresh(resolved)) {
      isConstant = true;
      return resolved;
    }
    if (isExpired(resolved)) {
      await coalesceProvider();
      return resolved;
    }
    return resolved;
  };
};

// node_modules/.pnpm/@smithy+eventstream-codec@2.0.6/node_modules/@smithy/eventstream-codec/dist-es/EventStreamCodec.js
var import_crc322 = __toESM(require_build2());

// node_modules/.pnpm/@smithy+util-hex-encoding@2.0.0/node_modules/@smithy/util-hex-encoding/dist-es/index.js
var SHORT_TO_HEX = {};
var HEX_TO_SHORT = {};
for (let i5 = 0; i5 < 256; i5++) {
  let encodedByte = i5.toString(16).toLowerCase();
  if (encodedByte.length === 1) {
    encodedByte = `0${encodedByte}`;
  }
  SHORT_TO_HEX[i5] = encodedByte;
  HEX_TO_SHORT[encodedByte] = i5;
}
function fromHex(encoded) {
  if (encoded.length % 2 !== 0) {
    throw new Error("Hex encoded strings must have an even number length");
  }
  const out = new Uint8Array(encoded.length / 2);
  for (let i5 = 0; i5 < encoded.length; i5 += 2) {
    const encodedByte = encoded.slice(i5, i5 + 2).toLowerCase();
    if (encodedByte in HEX_TO_SHORT) {
      out[i5 / 2] = HEX_TO_SHORT[encodedByte];
    } else {
      throw new Error(`Cannot decode unrecognized sequence ${encodedByte} as hexadecimal`);
    }
  }
  return out;
}
function toHex(bytes) {
  let out = "";
  for (let i5 = 0; i5 < bytes.byteLength; i5++) {
    out += SHORT_TO_HEX[bytes[i5]];
  }
  return out;
}

// node_modules/.pnpm/@smithy+eventstream-codec@2.0.6/node_modules/@smithy/eventstream-codec/dist-es/Int64.js
var Int64 = class _Int64 {
  constructor(bytes) {
    this.bytes = bytes;
    if (bytes.byteLength !== 8) {
      throw new Error("Int64 buffers must be exactly 8 bytes");
    }
  }
  static fromNumber(number) {
    if (number > 9223372036854776e3 || number < -9223372036854776e3) {
      throw new Error(`${number} is too large (or, if negative, too small) to represent as an Int64`);
    }
    const bytes = new Uint8Array(8);
    for (let i5 = 7, remaining = Math.abs(Math.round(number)); i5 > -1 && remaining > 0; i5--, remaining /= 256) {
      bytes[i5] = remaining;
    }
    if (number < 0) {
      negate(bytes);
    }
    return new _Int64(bytes);
  }
  valueOf() {
    const bytes = this.bytes.slice(0);
    const negative = bytes[0] & 128;
    if (negative) {
      negate(bytes);
    }
    return parseInt(toHex(bytes), 16) * (negative ? -1 : 1);
  }
  toString() {
    return String(this.valueOf());
  }
};
function negate(bytes) {
  for (let i5 = 0; i5 < 8; i5++) {
    bytes[i5] ^= 255;
  }
  for (let i5 = 7; i5 > -1; i5--) {
    bytes[i5]++;
    if (bytes[i5] !== 0)
      break;
  }
}

// node_modules/.pnpm/@smithy+eventstream-codec@2.0.6/node_modules/@smithy/eventstream-codec/dist-es/HeaderMarshaller.js
var HeaderMarshaller = class {
  constructor(toUtf85, fromUtf85) {
    this.toUtf8 = toUtf85;
    this.fromUtf8 = fromUtf85;
  }
  format(headers) {
    const chunks = [];
    for (const headerName of Object.keys(headers)) {
      const bytes = this.fromUtf8(headerName);
      chunks.push(Uint8Array.from([bytes.byteLength]), bytes, this.formatHeaderValue(headers[headerName]));
    }
    const out = new Uint8Array(chunks.reduce((carry, bytes) => carry + bytes.byteLength, 0));
    let position = 0;
    for (const chunk of chunks) {
      out.set(chunk, position);
      position += chunk.byteLength;
    }
    return out;
  }
  formatHeaderValue(header) {
    switch (header.type) {
      case "boolean":
        return Uint8Array.from([header.value ? 0 : 1]);
      case "byte":
        return Uint8Array.from([2, header.value]);
      case "short":
        const shortView = new DataView(new ArrayBuffer(3));
        shortView.setUint8(0, 3);
        shortView.setInt16(1, header.value, false);
        return new Uint8Array(shortView.buffer);
      case "integer":
        const intView = new DataView(new ArrayBuffer(5));
        intView.setUint8(0, 4);
        intView.setInt32(1, header.value, false);
        return new Uint8Array(intView.buffer);
      case "long":
        const longBytes = new Uint8Array(9);
        longBytes[0] = 5;
        longBytes.set(header.value.bytes, 1);
        return longBytes;
      case "binary":
        const binView = new DataView(new ArrayBuffer(3 + header.value.byteLength));
        binView.setUint8(0, 6);
        binView.setUint16(1, header.value.byteLength, false);
        const binBytes = new Uint8Array(binView.buffer);
        binBytes.set(header.value, 3);
        return binBytes;
      case "string":
        const utf8Bytes = this.fromUtf8(header.value);
        const strView = new DataView(new ArrayBuffer(3 + utf8Bytes.byteLength));
        strView.setUint8(0, 7);
        strView.setUint16(1, utf8Bytes.byteLength, false);
        const strBytes = new Uint8Array(strView.buffer);
        strBytes.set(utf8Bytes, 3);
        return strBytes;
      case "timestamp":
        const tsBytes = new Uint8Array(9);
        tsBytes[0] = 8;
        tsBytes.set(Int64.fromNumber(header.value.valueOf()).bytes, 1);
        return tsBytes;
      case "uuid":
        if (!UUID_PATTERN.test(header.value)) {
          throw new Error(`Invalid UUID received: ${header.value}`);
        }
        const uuidBytes = new Uint8Array(17);
        uuidBytes[0] = 9;
        uuidBytes.set(fromHex(header.value.replace(/\-/g, "")), 1);
        return uuidBytes;
    }
  }
  parse(headers) {
    const out = {};
    let position = 0;
    while (position < headers.byteLength) {
      const nameLength = headers.getUint8(position++);
      const name = this.toUtf8(new Uint8Array(headers.buffer, headers.byteOffset + position, nameLength));
      position += nameLength;
      switch (headers.getUint8(position++)) {
        case 0:
          out[name] = {
            type: BOOLEAN_TAG,
            value: true
          };
          break;
        case 1:
          out[name] = {
            type: BOOLEAN_TAG,
            value: false
          };
          break;
        case 2:
          out[name] = {
            type: BYTE_TAG,
            value: headers.getInt8(position++)
          };
          break;
        case 3:
          out[name] = {
            type: SHORT_TAG,
            value: headers.getInt16(position, false)
          };
          position += 2;
          break;
        case 4:
          out[name] = {
            type: INT_TAG,
            value: headers.getInt32(position, false)
          };
          position += 4;
          break;
        case 5:
          out[name] = {
            type: LONG_TAG,
            value: new Int64(new Uint8Array(headers.buffer, headers.byteOffset + position, 8))
          };
          position += 8;
          break;
        case 6:
          const binaryLength = headers.getUint16(position, false);
          position += 2;
          out[name] = {
            type: BINARY_TAG,
            value: new Uint8Array(headers.buffer, headers.byteOffset + position, binaryLength)
          };
          position += binaryLength;
          break;
        case 7:
          const stringLength = headers.getUint16(position, false);
          position += 2;
          out[name] = {
            type: STRING_TAG,
            value: this.toUtf8(new Uint8Array(headers.buffer, headers.byteOffset + position, stringLength))
          };
          position += stringLength;
          break;
        case 8:
          out[name] = {
            type: TIMESTAMP_TAG,
            value: new Date(new Int64(new Uint8Array(headers.buffer, headers.byteOffset + position, 8)).valueOf())
          };
          position += 8;
          break;
        case 9:
          const uuidBytes = new Uint8Array(headers.buffer, headers.byteOffset + position, 16);
          position += 16;
          out[name] = {
            type: UUID_TAG,
            value: `${toHex(uuidBytes.subarray(0, 4))}-${toHex(uuidBytes.subarray(4, 6))}-${toHex(uuidBytes.subarray(6, 8))}-${toHex(uuidBytes.subarray(8, 10))}-${toHex(uuidBytes.subarray(10))}`
          };
          break;
        default:
          throw new Error(`Unrecognized header type tag`);
      }
    }
    return out;
  }
};
var HEADER_VALUE_TYPE;
(function(HEADER_VALUE_TYPE2) {
  HEADER_VALUE_TYPE2[HEADER_VALUE_TYPE2["boolTrue"] = 0] = "boolTrue";
  HEADER_VALUE_TYPE2[HEADER_VALUE_TYPE2["boolFalse"] = 1] = "boolFalse";
  HEADER_VALUE_TYPE2[HEADER_VALUE_TYPE2["byte"] = 2] = "byte";
  HEADER_VALUE_TYPE2[HEADER_VALUE_TYPE2["short"] = 3] = "short";
  HEADER_VALUE_TYPE2[HEADER_VALUE_TYPE2["integer"] = 4] = "integer";
  HEADER_VALUE_TYPE2[HEADER_VALUE_TYPE2["long"] = 5] = "long";
  HEADER_VALUE_TYPE2[HEADER_VALUE_TYPE2["byteArray"] = 6] = "byteArray";
  HEADER_VALUE_TYPE2[HEADER_VALUE_TYPE2["string"] = 7] = "string";
  HEADER_VALUE_TYPE2[HEADER_VALUE_TYPE2["timestamp"] = 8] = "timestamp";
  HEADER_VALUE_TYPE2[HEADER_VALUE_TYPE2["uuid"] = 9] = "uuid";
})(HEADER_VALUE_TYPE || (HEADER_VALUE_TYPE = {}));
var BOOLEAN_TAG = "boolean";
var BYTE_TAG = "byte";
var SHORT_TAG = "short";
var INT_TAG = "integer";
var LONG_TAG = "long";
var BINARY_TAG = "binary";
var STRING_TAG = "string";
var TIMESTAMP_TAG = "timestamp";
var UUID_TAG = "uuid";
var UUID_PATTERN = /^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/;

// node_modules/.pnpm/@smithy+eventstream-codec@2.0.6/node_modules/@smithy/eventstream-codec/dist-es/splitMessage.js
var import_crc32 = __toESM(require_build2());
var PRELUDE_MEMBER_LENGTH = 4;
var PRELUDE_LENGTH = PRELUDE_MEMBER_LENGTH * 2;
var CHECKSUM_LENGTH = 4;
var MINIMUM_MESSAGE_LENGTH = PRELUDE_LENGTH + CHECKSUM_LENGTH * 2;
function splitMessage({ byteLength, byteOffset, buffer }) {
  if (byteLength < MINIMUM_MESSAGE_LENGTH) {
    throw new Error("Provided message too short to accommodate event stream message overhead");
  }
  const view = new DataView(buffer, byteOffset, byteLength);
  const messageLength = view.getUint32(0, false);
  if (byteLength !== messageLength) {
    throw new Error("Reported message length does not match received message length");
  }
  const headerLength = view.getUint32(PRELUDE_MEMBER_LENGTH, false);
  const expectedPreludeChecksum = view.getUint32(PRELUDE_LENGTH, false);
  const expectedMessageChecksum = view.getUint32(byteLength - CHECKSUM_LENGTH, false);
  const checksummer = new import_crc32.Crc32().update(new Uint8Array(buffer, byteOffset, PRELUDE_LENGTH));
  if (expectedPreludeChecksum !== checksummer.digest()) {
    throw new Error(`The prelude checksum specified in the message (${expectedPreludeChecksum}) does not match the calculated CRC32 checksum (${checksummer.digest()})`);
  }
  checksummer.update(new Uint8Array(buffer, byteOffset + PRELUDE_LENGTH, byteLength - (PRELUDE_LENGTH + CHECKSUM_LENGTH)));
  if (expectedMessageChecksum !== checksummer.digest()) {
    throw new Error(`The message checksum (${checksummer.digest()}) did not match the expected value of ${expectedMessageChecksum}`);
  }
  return {
    headers: new DataView(buffer, byteOffset + PRELUDE_LENGTH + CHECKSUM_LENGTH, headerLength),
    body: new Uint8Array(buffer, byteOffset + PRELUDE_LENGTH + CHECKSUM_LENGTH + headerLength, messageLength - headerLength - (PRELUDE_LENGTH + CHECKSUM_LENGTH + CHECKSUM_LENGTH))
  };
}

// node_modules/.pnpm/@smithy+eventstream-codec@2.0.6/node_modules/@smithy/eventstream-codec/dist-es/EventStreamCodec.js
var EventStreamCodec = class {
  constructor(toUtf85, fromUtf85) {
    this.headerMarshaller = new HeaderMarshaller(toUtf85, fromUtf85);
    this.messageBuffer = [];
    this.isEndOfStream = false;
  }
  feed(message) {
    this.messageBuffer.push(this.decode(message));
  }
  endOfStream() {
    this.isEndOfStream = true;
  }
  getMessage() {
    const message = this.messageBuffer.pop();
    const isEndOfStream = this.isEndOfStream;
    return {
      getMessage() {
        return message;
      },
      isEndOfStream() {
        return isEndOfStream;
      }
    };
  }
  getAvailableMessages() {
    const messages = this.messageBuffer;
    this.messageBuffer = [];
    const isEndOfStream = this.isEndOfStream;
    return {
      getMessages() {
        return messages;
      },
      isEndOfStream() {
        return isEndOfStream;
      }
    };
  }
  encode({ headers: rawHeaders, body }) {
    const headers = this.headerMarshaller.format(rawHeaders);
    const length = headers.byteLength + body.byteLength + 16;
    const out = new Uint8Array(length);
    const view = new DataView(out.buffer, out.byteOffset, out.byteLength);
    const checksum = new import_crc322.Crc32();
    view.setUint32(0, length, false);
    view.setUint32(4, headers.byteLength, false);
    view.setUint32(8, checksum.update(out.subarray(0, 8)).digest(), false);
    out.set(headers, 12);
    out.set(body, headers.byteLength + 12);
    view.setUint32(length - 4, checksum.update(out.subarray(8, length - 4)).digest(), false);
    return out;
  }
  decode(message) {
    const { headers, body } = splitMessage(message);
    return { headers: this.headerMarshaller.parse(headers), body };
  }
  formatHeaders(rawHeaders) {
    return this.headerMarshaller.format(rawHeaders);
  }
};

// node_modules/.pnpm/@smithy+eventstream-codec@2.0.6/node_modules/@smithy/eventstream-codec/dist-es/MessageDecoderStream.js
var MessageDecoderStream = class {
  constructor(options) {
    this.options = options;
  }
  [Symbol.asyncIterator]() {
    return this.asyncIterator();
  }
  async *asyncIterator() {
    for await (const bytes of this.options.inputStream) {
      const decoded = this.options.decoder.decode(bytes);
      yield decoded;
    }
  }
};

// node_modules/.pnpm/@smithy+eventstream-codec@2.0.6/node_modules/@smithy/eventstream-codec/dist-es/MessageEncoderStream.js
var MessageEncoderStream = class {
  constructor(options) {
    this.options = options;
  }
  [Symbol.asyncIterator]() {
    return this.asyncIterator();
  }
  async *asyncIterator() {
    for await (const msg of this.options.messageStream) {
      const encoded = this.options.encoder.encode(msg);
      yield encoded;
    }
    if (this.options.includeEndFrame) {
      yield new Uint8Array(0);
    }
  }
};

// node_modules/.pnpm/@smithy+eventstream-codec@2.0.6/node_modules/@smithy/eventstream-codec/dist-es/SmithyMessageDecoderStream.js
var SmithyMessageDecoderStream = class {
  constructor(options) {
    this.options = options;
  }
  [Symbol.asyncIterator]() {
    return this.asyncIterator();
  }
  async *asyncIterator() {
    for await (const message of this.options.messageStream) {
      const deserialized = await this.options.deserializer(message);
      if (deserialized === void 0)
        continue;
      yield deserialized;
    }
  }
};

// node_modules/.pnpm/@smithy+eventstream-codec@2.0.6/node_modules/@smithy/eventstream-codec/dist-es/SmithyMessageEncoderStream.js
var SmithyMessageEncoderStream = class {
  constructor(options) {
    this.options = options;
  }
  [Symbol.asyncIterator]() {
    return this.asyncIterator();
  }
  async *asyncIterator() {
    for await (const chunk of this.options.inputStream) {
      const payloadBuf = this.options.serializer(chunk);
      yield payloadBuf;
    }
  }
};

// node_modules/.pnpm/@smithy+util-middleware@2.0.0/node_modules/@smithy/util-middleware/dist-es/normalizeProvider.js
var normalizeProvider = (input) => {
  if (typeof input === "function")
    return input;
  const promisified = Promise.resolve(input);
  return () => promisified;
};

// node_modules/.pnpm/@smithy+is-array-buffer@2.0.0/node_modules/@smithy/is-array-buffer/dist-es/index.js
var isArrayBuffer = (arg) => typeof ArrayBuffer === "function" && arg instanceof ArrayBuffer || Object.prototype.toString.call(arg) === "[object ArrayBuffer]";

// node_modules/.pnpm/@smithy+util-buffer-from@2.0.0/node_modules/@smithy/util-buffer-from/dist-es/index.js
var import_buffer = require("buffer");
var fromArrayBuffer = (input, offset = 0, length = input.byteLength - offset) => {
  if (!isArrayBuffer(input)) {
    throw new TypeError(`The "input" argument must be ArrayBuffer. Received type ${typeof input} (${input})`);
  }
  return import_buffer.Buffer.from(input, offset, length);
};
var fromString = (input, encoding) => {
  if (typeof input !== "string") {
    throw new TypeError(`The "input" argument must be of type string. Received type ${typeof input} (${input})`);
  }
  return encoding ? import_buffer.Buffer.from(input, encoding) : import_buffer.Buffer.from(input);
};

// node_modules/.pnpm/@smithy+util-utf8@2.0.0/node_modules/@smithy/util-utf8/dist-es/fromUtf8.js
var fromUtf84 = (input) => {
  const buf = fromString(input, "utf8");
  return new Uint8Array(buf.buffer, buf.byteOffset, buf.byteLength / Uint8Array.BYTES_PER_ELEMENT);
};

// node_modules/.pnpm/@smithy+util-utf8@2.0.0/node_modules/@smithy/util-utf8/dist-es/toUint8Array.js
var toUint8Array = (data) => {
  if (typeof data === "string") {
    return fromUtf84(data);
  }
  if (ArrayBuffer.isView(data)) {
    return new Uint8Array(data.buffer, data.byteOffset, data.byteLength / Uint8Array.BYTES_PER_ELEMENT);
  }
  return new Uint8Array(data);
};

// node_modules/.pnpm/@smithy+util-utf8@2.0.0/node_modules/@smithy/util-utf8/dist-es/toUtf8.js
var toUtf84 = (input) => fromArrayBuffer(input.buffer, input.byteOffset, input.byteLength).toString("utf8");

// node_modules/.pnpm/@smithy+signature-v4@2.0.6/node_modules/@smithy/signature-v4/dist-es/constants.js
var ALGORITHM_QUERY_PARAM = "X-Amz-Algorithm";
var CREDENTIAL_QUERY_PARAM = "X-Amz-Credential";
var AMZ_DATE_QUERY_PARAM = "X-Amz-Date";
var SIGNED_HEADERS_QUERY_PARAM = "X-Amz-SignedHeaders";
var EXPIRES_QUERY_PARAM = "X-Amz-Expires";
var SIGNATURE_QUERY_PARAM = "X-Amz-Signature";
var TOKEN_QUERY_PARAM = "X-Amz-Security-Token";
var AUTH_HEADER = "authorization";
var AMZ_DATE_HEADER = AMZ_DATE_QUERY_PARAM.toLowerCase();
var DATE_HEADER = "date";
var GENERATED_HEADERS = [AUTH_HEADER, AMZ_DATE_HEADER, DATE_HEADER];
var SIGNATURE_HEADER = SIGNATURE_QUERY_PARAM.toLowerCase();
var SHA256_HEADER = "x-amz-content-sha256";
var TOKEN_HEADER = TOKEN_QUERY_PARAM.toLowerCase();
var ALWAYS_UNSIGNABLE_HEADERS = {
  authorization: true,
  "cache-control": true,
  connection: true,
  expect: true,
  from: true,
  "keep-alive": true,
  "max-forwards": true,
  pragma: true,
  referer: true,
  te: true,
  trailer: true,
  "transfer-encoding": true,
  upgrade: true,
  "user-agent": true,
  "x-amzn-trace-id": true
};
var PROXY_HEADER_PATTERN = /^proxy-/;
var SEC_HEADER_PATTERN = /^sec-/;
var ALGORITHM_IDENTIFIER = "AWS4-HMAC-SHA256";
var EVENT_ALGORITHM_IDENTIFIER = "AWS4-HMAC-SHA256-PAYLOAD";
var UNSIGNED_PAYLOAD = "UNSIGNED-PAYLOAD";
var MAX_CACHE_SIZE = 50;
var KEY_TYPE_IDENTIFIER = "aws4_request";
var MAX_PRESIGNED_TTL = 60 * 60 * 24 * 7;

// node_modules/.pnpm/@smithy+signature-v4@2.0.6/node_modules/@smithy/signature-v4/dist-es/credentialDerivation.js
var signingKeyCache = {};
var cacheQueue = [];
var createScope = (shortDate, region, service) => `${shortDate}/${region}/${service}/${KEY_TYPE_IDENTIFIER}`;
var getSigningKey = async (sha256Constructor, credentials, shortDate, region, service) => {
  const credsHash = await hmac(sha256Constructor, credentials.secretAccessKey, credentials.accessKeyId);
  const cacheKey = `${shortDate}:${region}:${service}:${toHex(credsHash)}:${credentials.sessionToken}`;
  if (cacheKey in signingKeyCache) {
    return signingKeyCache[cacheKey];
  }
  cacheQueue.push(cacheKey);
  while (cacheQueue.length > MAX_CACHE_SIZE) {
    delete signingKeyCache[cacheQueue.shift()];
  }
  let key = `AWS4${credentials.secretAccessKey}`;
  for (const signable of [shortDate, region, service, KEY_TYPE_IDENTIFIER]) {
    key = await hmac(sha256Constructor, key, signable);
  }
  return signingKeyCache[cacheKey] = key;
};
var hmac = (ctor, secret, data) => {
  const hash = new ctor(secret);
  hash.update(toUint8Array(data));
  return hash.digest();
};

// node_modules/.pnpm/@smithy+signature-v4@2.0.6/node_modules/@smithy/signature-v4/dist-es/getCanonicalHeaders.js
var getCanonicalHeaders = ({ headers }, unsignableHeaders, signableHeaders) => {
  const canonical = {};
  for (const headerName of Object.keys(headers).sort()) {
    if (headers[headerName] == void 0) {
      continue;
    }
    const canonicalHeaderName = headerName.toLowerCase();
    if (canonicalHeaderName in ALWAYS_UNSIGNABLE_HEADERS || (unsignableHeaders == null ? void 0 : unsignableHeaders.has(canonicalHeaderName)) || PROXY_HEADER_PATTERN.test(canonicalHeaderName) || SEC_HEADER_PATTERN.test(canonicalHeaderName)) {
      if (!signableHeaders || signableHeaders && !signableHeaders.has(canonicalHeaderName)) {
        continue;
      }
    }
    canonical[canonicalHeaderName] = headers[headerName].trim().replace(/\s+/g, " ");
  }
  return canonical;
};

// node_modules/.pnpm/@smithy+util-uri-escape@2.0.0/node_modules/@smithy/util-uri-escape/dist-es/escape-uri.js
var escapeUri = (uri) => encodeURIComponent(uri).replace(/[!'()*]/g, hexEncode);
var hexEncode = (c5) => `%${c5.charCodeAt(0).toString(16).toUpperCase()}`;

// node_modules/.pnpm/@smithy+signature-v4@2.0.6/node_modules/@smithy/signature-v4/dist-es/getCanonicalQuery.js
var getCanonicalQuery = ({ query = {} }) => {
  const keys = [];
  const serialized = {};
  for (const key of Object.keys(query).sort()) {
    if (key.toLowerCase() === SIGNATURE_HEADER) {
      continue;
    }
    keys.push(key);
    const value = query[key];
    if (typeof value === "string") {
      serialized[key] = `${escapeUri(key)}=${escapeUri(value)}`;
    } else if (Array.isArray(value)) {
      serialized[key] = value.slice(0).reduce((encoded, value2) => encoded.concat([`${escapeUri(key)}=${escapeUri(value2)}`]), []).sort().join("&");
    }
  }
  return keys.map((key) => serialized[key]).filter((serialized2) => serialized2).join("&");
};

// node_modules/.pnpm/@smithy+signature-v4@2.0.6/node_modules/@smithy/signature-v4/dist-es/getPayloadHash.js
var getPayloadHash = async ({ headers, body }, hashConstructor) => {
  for (const headerName of Object.keys(headers)) {
    if (headerName.toLowerCase() === SHA256_HEADER) {
      return headers[headerName];
    }
  }
  if (body == void 0) {
    return "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855";
  } else if (typeof body === "string" || ArrayBuffer.isView(body) || isArrayBuffer(body)) {
    const hashCtor = new hashConstructor();
    hashCtor.update(toUint8Array(body));
    return toHex(await hashCtor.digest());
  }
  return UNSIGNED_PAYLOAD;
};

// node_modules/.pnpm/@smithy+signature-v4@2.0.6/node_modules/@smithy/signature-v4/dist-es/headerUtil.js
var hasHeader = (soughtHeader, headers) => {
  soughtHeader = soughtHeader.toLowerCase();
  for (const headerName of Object.keys(headers)) {
    if (soughtHeader === headerName.toLowerCase()) {
      return true;
    }
  }
  return false;
};

// node_modules/.pnpm/@smithy+signature-v4@2.0.6/node_modules/@smithy/signature-v4/dist-es/cloneRequest.js
var cloneRequest = ({ headers, query, ...rest }) => ({
  ...rest,
  headers: { ...headers },
  query: query ? cloneQuery2(query) : void 0
});
var cloneQuery2 = (query) => Object.keys(query).reduce((carry, paramName) => {
  const param = query[paramName];
  return {
    ...carry,
    [paramName]: Array.isArray(param) ? [...param] : param
  };
}, {});

// node_modules/.pnpm/@smithy+signature-v4@2.0.6/node_modules/@smithy/signature-v4/dist-es/moveHeadersToQuery.js
var moveHeadersToQuery = (request2, options = {}) => {
  var _a;
  const { headers, query = {} } = typeof request2.clone === "function" ? request2.clone() : cloneRequest(request2);
  for (const name of Object.keys(headers)) {
    const lname = name.toLowerCase();
    if (lname.slice(0, 6) === "x-amz-" && !((_a = options.unhoistableHeaders) == null ? void 0 : _a.has(lname))) {
      query[name] = headers[name];
      delete headers[name];
    }
  }
  return {
    ...request2,
    headers,
    query
  };
};

// node_modules/.pnpm/@smithy+signature-v4@2.0.6/node_modules/@smithy/signature-v4/dist-es/prepareRequest.js
var prepareRequest = (request2) => {
  request2 = typeof request2.clone === "function" ? request2.clone() : cloneRequest(request2);
  for (const headerName of Object.keys(request2.headers)) {
    if (GENERATED_HEADERS.indexOf(headerName.toLowerCase()) > -1) {
      delete request2.headers[headerName];
    }
  }
  return request2;
};

// node_modules/.pnpm/@smithy+signature-v4@2.0.6/node_modules/@smithy/signature-v4/dist-es/utilDate.js
var iso8601 = (time) => toDate(time).toISOString().replace(/\.\d{3}Z$/, "Z");
var toDate = (time) => {
  if (typeof time === "number") {
    return new Date(time * 1e3);
  }
  if (typeof time === "string") {
    if (Number(time)) {
      return new Date(Number(time) * 1e3);
    }
    return new Date(time);
  }
  return time;
};

// node_modules/.pnpm/@smithy+signature-v4@2.0.6/node_modules/@smithy/signature-v4/dist-es/SignatureV4.js
var SignatureV4 = class {
  constructor({ applyChecksum, credentials, region, service, sha256, uriEscapePath = true }) {
    this.headerMarshaller = new HeaderMarshaller(toUtf84, fromUtf84);
    this.service = service;
    this.sha256 = sha256;
    this.uriEscapePath = uriEscapePath;
    this.applyChecksum = typeof applyChecksum === "boolean" ? applyChecksum : true;
    this.regionProvider = normalizeProvider(region);
    this.credentialProvider = normalizeProvider(credentials);
  }
  async presign(originalRequest, options = {}) {
    const { signingDate = /* @__PURE__ */ new Date(), expiresIn = 3600, unsignableHeaders, unhoistableHeaders, signableHeaders, signingRegion, signingService } = options;
    const credentials = await this.credentialProvider();
    this.validateResolvedCredentials(credentials);
    const region = signingRegion != null ? signingRegion : await this.regionProvider();
    const { longDate, shortDate } = formatDate(signingDate);
    if (expiresIn > MAX_PRESIGNED_TTL) {
      return Promise.reject("Signature version 4 presigned URLs must have an expiration date less than one week in the future");
    }
    const scope = createScope(shortDate, region, signingService != null ? signingService : this.service);
    const request2 = moveHeadersToQuery(prepareRequest(originalRequest), { unhoistableHeaders });
    if (credentials.sessionToken) {
      request2.query[TOKEN_QUERY_PARAM] = credentials.sessionToken;
    }
    request2.query[ALGORITHM_QUERY_PARAM] = ALGORITHM_IDENTIFIER;
    request2.query[CREDENTIAL_QUERY_PARAM] = `${credentials.accessKeyId}/${scope}`;
    request2.query[AMZ_DATE_QUERY_PARAM] = longDate;
    request2.query[EXPIRES_QUERY_PARAM] = expiresIn.toString(10);
    const canonicalHeaders = getCanonicalHeaders(request2, unsignableHeaders, signableHeaders);
    request2.query[SIGNED_HEADERS_QUERY_PARAM] = getCanonicalHeaderList(canonicalHeaders);
    request2.query[SIGNATURE_QUERY_PARAM] = await this.getSignature(longDate, scope, this.getSigningKey(credentials, region, shortDate, signingService), this.createCanonicalRequest(request2, canonicalHeaders, await getPayloadHash(originalRequest, this.sha256)));
    return request2;
  }
  async sign(toSign, options) {
    if (typeof toSign === "string") {
      return this.signString(toSign, options);
    } else if (toSign.headers && toSign.payload) {
      return this.signEvent(toSign, options);
    } else if (toSign.message) {
      return this.signMessage(toSign, options);
    } else {
      return this.signRequest(toSign, options);
    }
  }
  async signEvent({ headers, payload }, { signingDate = /* @__PURE__ */ new Date(), priorSignature, signingRegion, signingService }) {
    const region = signingRegion != null ? signingRegion : await this.regionProvider();
    const { shortDate, longDate } = formatDate(signingDate);
    const scope = createScope(shortDate, region, signingService != null ? signingService : this.service);
    const hashedPayload = await getPayloadHash({ headers: {}, body: payload }, this.sha256);
    const hash = new this.sha256();
    hash.update(headers);
    const hashedHeaders = toHex(await hash.digest());
    const stringToSign = [
      EVENT_ALGORITHM_IDENTIFIER,
      longDate,
      scope,
      priorSignature,
      hashedHeaders,
      hashedPayload
    ].join("\n");
    return this.signString(stringToSign, { signingDate, signingRegion: region, signingService });
  }
  async signMessage(signableMessage, { signingDate = /* @__PURE__ */ new Date(), signingRegion, signingService }) {
    const promise = this.signEvent({
      headers: this.headerMarshaller.format(signableMessage.message.headers),
      payload: signableMessage.message.body
    }, {
      signingDate,
      signingRegion,
      signingService,
      priorSignature: signableMessage.priorSignature
    });
    return promise.then((signature) => {
      return { message: signableMessage.message, signature };
    });
  }
  async signString(stringToSign, { signingDate = /* @__PURE__ */ new Date(), signingRegion, signingService } = {}) {
    const credentials = await this.credentialProvider();
    this.validateResolvedCredentials(credentials);
    const region = signingRegion != null ? signingRegion : await this.regionProvider();
    const { shortDate } = formatDate(signingDate);
    const hash = new this.sha256(await this.getSigningKey(credentials, region, shortDate, signingService));
    hash.update(toUint8Array(stringToSign));
    return toHex(await hash.digest());
  }
  async signRequest(requestToSign, { signingDate = /* @__PURE__ */ new Date(), signableHeaders, unsignableHeaders, signingRegion, signingService } = {}) {
    const credentials = await this.credentialProvider();
    this.validateResolvedCredentials(credentials);
    const region = signingRegion != null ? signingRegion : await this.regionProvider();
    const request2 = prepareRequest(requestToSign);
    const { longDate, shortDate } = formatDate(signingDate);
    const scope = createScope(shortDate, region, signingService != null ? signingService : this.service);
    request2.headers[AMZ_DATE_HEADER] = longDate;
    if (credentials.sessionToken) {
      request2.headers[TOKEN_HEADER] = credentials.sessionToken;
    }
    const payloadHash = await getPayloadHash(request2, this.sha256);
    if (!hasHeader(SHA256_HEADER, request2.headers) && this.applyChecksum) {
      request2.headers[SHA256_HEADER] = payloadHash;
    }
    const canonicalHeaders = getCanonicalHeaders(request2, unsignableHeaders, signableHeaders);
    const signature = await this.getSignature(longDate, scope, this.getSigningKey(credentials, region, shortDate, signingService), this.createCanonicalRequest(request2, canonicalHeaders, payloadHash));
    request2.headers[AUTH_HEADER] = `${ALGORITHM_IDENTIFIER} Credential=${credentials.accessKeyId}/${scope}, SignedHeaders=${getCanonicalHeaderList(canonicalHeaders)}, Signature=${signature}`;
    return request2;
  }
  createCanonicalRequest(request2, canonicalHeaders, payloadHash) {
    const sortedHeaders = Object.keys(canonicalHeaders).sort();
    return `${request2.method}
${this.getCanonicalPath(request2)}
${getCanonicalQuery(request2)}
${sortedHeaders.map((name) => `${name}:${canonicalHeaders[name]}`).join("\n")}

${sortedHeaders.join(";")}
${payloadHash}`;
  }
  async createStringToSign(longDate, credentialScope, canonicalRequest) {
    const hash = new this.sha256();
    hash.update(toUint8Array(canonicalRequest));
    const hashedRequest = await hash.digest();
    return `${ALGORITHM_IDENTIFIER}
${longDate}
${credentialScope}
${toHex(hashedRequest)}`;
  }
  getCanonicalPath({ path }) {
    if (this.uriEscapePath) {
      const normalizedPathSegments = [];
      for (const pathSegment of path.split("/")) {
        if ((pathSegment == null ? void 0 : pathSegment.length) === 0)
          continue;
        if (pathSegment === ".")
          continue;
        if (pathSegment === "..") {
          normalizedPathSegments.pop();
        } else {
          normalizedPathSegments.push(pathSegment);
        }
      }
      const normalizedPath = `${(path == null ? void 0 : path.startsWith("/")) ? "/" : ""}${normalizedPathSegments.join("/")}${normalizedPathSegments.length > 0 && (path == null ? void 0 : path.endsWith("/")) ? "/" : ""}`;
      const doubleEncoded = encodeURIComponent(normalizedPath);
      return doubleEncoded.replace(/%2F/g, "/");
    }
    return path;
  }
  async getSignature(longDate, credentialScope, keyPromise, canonicalRequest) {
    const stringToSign = await this.createStringToSign(longDate, credentialScope, canonicalRequest);
    const hash = new this.sha256(await keyPromise);
    hash.update(toUint8Array(stringToSign));
    return toHex(await hash.digest());
  }
  getSigningKey(credentials, region, shortDate, service) {
    return getSigningKey(this.sha256, credentials, shortDate, region, service || this.service);
  }
  validateResolvedCredentials(credentials) {
    if (typeof credentials !== "object" || typeof credentials.accessKeyId !== "string" || typeof credentials.secretAccessKey !== "string") {
      throw new Error("Resolved credential object is not valid");
    }
  }
};
var formatDate = (now) => {
  const longDate = iso8601(now).replace(/[\-:]/g, "");
  return {
    longDate,
    shortDate: longDate.slice(0, 8)
  };
};
var getCanonicalHeaderList = (headers) => Object.keys(headers).sort().join(";");

// node_modules/.pnpm/@aws-sdk+middleware-signing@3.408.0/node_modules/@aws-sdk/middleware-signing/dist-es/awsAuthConfiguration.js
var CREDENTIAL_EXPIRE_WINDOW = 3e5;
var resolveAwsAuthConfig = (input) => {
  const normalizedCreds = input.credentials ? normalizeCredentialProvider(input.credentials) : input.credentialDefaultProvider(input);
  const { signingEscapePath = true, systemClockOffset = input.systemClockOffset || 0, sha256 } = input;
  let signer;
  if (input.signer) {
    signer = normalizeProvider(input.signer);
  } else if (input.regionInfoProvider) {
    signer = () => normalizeProvider(input.region)().then(async (region) => [
      await input.regionInfoProvider(region, {
        useFipsEndpoint: await input.useFipsEndpoint(),
        useDualstackEndpoint: await input.useDualstackEndpoint()
      }) || {},
      region
    ]).then(([regionInfo, region]) => {
      const { signingRegion, signingService } = regionInfo;
      input.signingRegion = input.signingRegion || signingRegion || region;
      input.signingName = input.signingName || signingService || input.serviceId;
      const params = {
        ...input,
        credentials: normalizedCreds,
        region: input.signingRegion,
        service: input.signingName,
        sha256,
        uriEscapePath: signingEscapePath
      };
      const SignerCtor = input.signerConstructor || SignatureV4;
      return new SignerCtor(params);
    });
  } else {
    signer = async (authScheme) => {
      authScheme = Object.assign({}, {
        name: "sigv4",
        signingName: input.signingName || input.defaultSigningName,
        signingRegion: await normalizeProvider(input.region)(),
        properties: {}
      }, authScheme);
      const signingRegion = authScheme.signingRegion;
      const signingService = authScheme.signingName;
      input.signingRegion = input.signingRegion || signingRegion;
      input.signingName = input.signingName || signingService || input.serviceId;
      const params = {
        ...input,
        credentials: normalizedCreds,
        region: input.signingRegion,
        service: input.signingName,
        sha256,
        uriEscapePath: signingEscapePath
      };
      const SignerCtor = input.signerConstructor || SignatureV4;
      return new SignerCtor(params);
    };
  }
  return {
    ...input,
    systemClockOffset,
    signingEscapePath,
    credentials: normalizedCreds,
    signer
  };
};
var normalizeCredentialProvider = (credentials) => {
  if (typeof credentials === "function") {
    return memoize(credentials, (credentials2) => credentials2.expiration !== void 0 && credentials2.expiration.getTime() - Date.now() < CREDENTIAL_EXPIRE_WINDOW, (credentials2) => credentials2.expiration !== void 0);
  }
  return normalizeProvider(credentials);
};

// node_modules/.pnpm/@aws-sdk+middleware-signing@3.408.0/node_modules/@aws-sdk/middleware-signing/dist-es/utils/getSkewCorrectedDate.js
var getSkewCorrectedDate = (systemClockOffset) => new Date(Date.now() + systemClockOffset);

// node_modules/.pnpm/@aws-sdk+middleware-signing@3.408.0/node_modules/@aws-sdk/middleware-signing/dist-es/utils/isClockSkewed.js
var isClockSkewed = (clockTime, systemClockOffset) => Math.abs(getSkewCorrectedDate(systemClockOffset).getTime() - clockTime) >= 3e5;

// node_modules/.pnpm/@aws-sdk+middleware-signing@3.408.0/node_modules/@aws-sdk/middleware-signing/dist-es/utils/getUpdatedSystemClockOffset.js
var getUpdatedSystemClockOffset = (clockTime, currentSystemClockOffset) => {
  const clockTimeInMs = Date.parse(clockTime);
  if (isClockSkewed(clockTimeInMs, currentSystemClockOffset)) {
    return clockTimeInMs - Date.now();
  }
  return currentSystemClockOffset;
};

// node_modules/.pnpm/@aws-sdk+middleware-signing@3.408.0/node_modules/@aws-sdk/middleware-signing/dist-es/awsAuthMiddleware.js
var awsAuthMiddleware = (options) => (next, context) => async function(args) {
  var _a, _b, _c, _d;
  if (!HttpRequest.isInstance(args.request))
    return next(args);
  const authScheme = (_c = (_b = (_a = context.endpointV2) == null ? void 0 : _a.properties) == null ? void 0 : _b.authSchemes) == null ? void 0 : _c[0];
  const multiRegionOverride = (authScheme == null ? void 0 : authScheme.name) === "sigv4a" ? (_d = authScheme == null ? void 0 : authScheme.signingRegionSet) == null ? void 0 : _d.join(",") : void 0;
  const signer = await options.signer(authScheme);
  const output = await next({
    ...args,
    request: await signer.sign(args.request, {
      signingDate: getSkewCorrectedDate(options.systemClockOffset),
      signingRegion: multiRegionOverride || context["signing_region"],
      signingService: context["signing_service"]
    })
  }).catch((error) => {
    var _a2;
    const serverTime = (_a2 = error.ServerTime) != null ? _a2 : getDateHeader(error.$response);
    if (serverTime) {
      options.systemClockOffset = getUpdatedSystemClockOffset(serverTime, options.systemClockOffset);
    }
    throw error;
  });
  const dateHeader = getDateHeader(output.response);
  if (dateHeader) {
    options.systemClockOffset = getUpdatedSystemClockOffset(dateHeader, options.systemClockOffset);
  }
  return output;
};
var getDateHeader = (response) => {
  var _a, _b, _c;
  return HttpResponse.isInstance(response) ? (_c = (_a = response.headers) == null ? void 0 : _a.date) != null ? _c : (_b = response.headers) == null ? void 0 : _b.Date : void 0;
};
var awsAuthMiddlewareOptions = {
  name: "awsAuthMiddleware",
  tags: ["SIGNATURE", "AWSAUTH"],
  relation: "after",
  toMiddleware: "retryMiddleware",
  override: true
};
var getAwsAuthPlugin = (options) => ({
  applyToStack: (clientStack) => {
    clientStack.addRelativeTo(awsAuthMiddleware(options), awsAuthMiddlewareOptions);
  }
});

// node_modules/.pnpm/@aws-sdk+middleware-user-agent@3.408.0/node_modules/@aws-sdk/middleware-user-agent/dist-es/configurations.js
function resolveUserAgentConfig(input) {
  return {
    ...input,
    customUserAgent: typeof input.customUserAgent === "string" ? [[input.customUserAgent]] : input.customUserAgent
  };
}

// node_modules/.pnpm/@aws-sdk+util-endpoints@3.408.0/node_modules/@aws-sdk/util-endpoints/dist-es/lib/aws/partitions.json
var partitions_default = {
  partitions: [{
    id: "aws",
    outputs: {
      dnsSuffix: "amazonaws.com",
      dualStackDnsSuffix: "api.aws",
      name: "aws",
      supportsDualStack: true,
      supportsFIPS: true
    },
    regionRegex: "^(us|eu|ap|sa|ca|me|af|il)\\-\\w+\\-\\d+$",
    regions: {
      "af-south-1": {
        description: "Africa (Cape Town)"
      },
      "ap-east-1": {
        description: "Asia Pacific (Hong Kong)"
      },
      "ap-northeast-1": {
        description: "Asia Pacific (Tokyo)"
      },
      "ap-northeast-2": {
        description: "Asia Pacific (Seoul)"
      },
      "ap-northeast-3": {
        description: "Asia Pacific (Osaka)"
      },
      "ap-south-1": {
        description: "Asia Pacific (Mumbai)"
      },
      "ap-south-2": {
        description: "Asia Pacific (Hyderabad)"
      },
      "ap-southeast-1": {
        description: "Asia Pacific (Singapore)"
      },
      "ap-southeast-2": {
        description: "Asia Pacific (Sydney)"
      },
      "ap-southeast-3": {
        description: "Asia Pacific (Jakarta)"
      },
      "ap-southeast-4": {
        description: "Asia Pacific (Melbourne)"
      },
      "aws-global": {
        description: "AWS Standard global region"
      },
      "ca-central-1": {
        description: "Canada (Central)"
      },
      "eu-central-1": {
        description: "Europe (Frankfurt)"
      },
      "eu-central-2": {
        description: "Europe (Zurich)"
      },
      "eu-north-1": {
        description: "Europe (Stockholm)"
      },
      "eu-south-1": {
        description: "Europe (Milan)"
      },
      "eu-south-2": {
        description: "Europe (Spain)"
      },
      "eu-west-1": {
        description: "Europe (Ireland)"
      },
      "eu-west-2": {
        description: "Europe (London)"
      },
      "eu-west-3": {
        description: "Europe (Paris)"
      },
      "il-central-1": {
        description: "Israel (Tel Aviv)"
      },
      "me-central-1": {
        description: "Middle East (UAE)"
      },
      "me-south-1": {
        description: "Middle East (Bahrain)"
      },
      "sa-east-1": {
        description: "South America (Sao Paulo)"
      },
      "us-east-1": {
        description: "US East (N. Virginia)"
      },
      "us-east-2": {
        description: "US East (Ohio)"
      },
      "us-west-1": {
        description: "US West (N. California)"
      },
      "us-west-2": {
        description: "US West (Oregon)"
      }
    }
  }, {
    id: "aws-cn",
    outputs: {
      dnsSuffix: "amazonaws.com.cn",
      dualStackDnsSuffix: "api.amazonwebservices.com.cn",
      name: "aws-cn",
      supportsDualStack: true,
      supportsFIPS: true
    },
    regionRegex: "^cn\\-\\w+\\-\\d+$",
    regions: {
      "aws-cn-global": {
        description: "AWS China global region"
      },
      "cn-north-1": {
        description: "China (Beijing)"
      },
      "cn-northwest-1": {
        description: "China (Ningxia)"
      }
    }
  }, {
    id: "aws-us-gov",
    outputs: {
      dnsSuffix: "amazonaws.com",
      dualStackDnsSuffix: "api.aws",
      name: "aws-us-gov",
      supportsDualStack: true,
      supportsFIPS: true
    },
    regionRegex: "^us\\-gov\\-\\w+\\-\\d+$",
    regions: {
      "aws-us-gov-global": {
        description: "AWS GovCloud (US) global region"
      },
      "us-gov-east-1": {
        description: "AWS GovCloud (US-East)"
      },
      "us-gov-west-1": {
        description: "AWS GovCloud (US-West)"
      }
    }
  }, {
    id: "aws-iso",
    outputs: {
      dnsSuffix: "c2s.ic.gov",
      dualStackDnsSuffix: "c2s.ic.gov",
      name: "aws-iso",
      supportsDualStack: false,
      supportsFIPS: true
    },
    regionRegex: "^us\\-iso\\-\\w+\\-\\d+$",
    regions: {
      "aws-iso-global": {
        description: "AWS ISO (US) global region"
      },
      "us-iso-east-1": {
        description: "US ISO East"
      },
      "us-iso-west-1": {
        description: "US ISO WEST"
      }
    }
  }, {
    id: "aws-iso-b",
    outputs: {
      dnsSuffix: "sc2s.sgov.gov",
      dualStackDnsSuffix: "sc2s.sgov.gov",
      name: "aws-iso-b",
      supportsDualStack: false,
      supportsFIPS: true
    },
    regionRegex: "^us\\-isob\\-\\w+\\-\\d+$",
    regions: {
      "aws-iso-b-global": {
        description: "AWS ISOB (US) global region"
      },
      "us-isob-east-1": {
        description: "US ISOB East (Ohio)"
      }
    }
  }, {
    id: "aws-iso-e",
    outputs: {
      dnsSuffix: "cloud.adc-e.uk",
      dualStackDnsSuffix: "cloud.adc-e.uk",
      name: "aws-iso-e",
      supportsDualStack: false,
      supportsFIPS: true
    },
    regionRegex: "^eu\\-isoe\\-\\w+\\-\\d+$",
    regions: {}
  }, {
    id: "aws-iso-f",
    outputs: {
      dnsSuffix: "csp.hci.ic.gov",
      dualStackDnsSuffix: "csp.hci.ic.gov",
      name: "aws-iso-f",
      supportsDualStack: false,
      supportsFIPS: true
    },
    regionRegex: "^us\\-isof\\-\\w+\\-\\d+$",
    regions: {}
  }],
  version: "1.1"
};

// node_modules/.pnpm/@aws-sdk+util-endpoints@3.408.0/node_modules/@aws-sdk/util-endpoints/dist-es/lib/aws/partition.js
var selectedPartitionsInfo = partitions_default;
var selectedUserAgentPrefix = "";
var partition = (value) => {
  const { partitions } = selectedPartitionsInfo;
  for (const partition2 of partitions) {
    const { regions, outputs } = partition2;
    for (const [region, regionData] of Object.entries(regions)) {
      if (region === value) {
        return {
          ...outputs,
          ...regionData
        };
      }
    }
  }
  for (const partition2 of partitions) {
    const { regionRegex, outputs } = partition2;
    if (new RegExp(regionRegex).test(value)) {
      return {
        ...outputs
      };
    }
  }
  const DEFAULT_PARTITION = partitions.find((partition2) => partition2.id === "aws");
  if (!DEFAULT_PARTITION) {
    throw new Error("Provided region was not found in the partition array or regex, and default partition with id 'aws' doesn't exist.");
  }
  return {
    ...DEFAULT_PARTITION.outputs
  };
};
var setPartitionInfo = (partitionsInfo, userAgentPrefix = "") => {
  selectedPartitionsInfo = partitionsInfo;
  selectedUserAgentPrefix = userAgentPrefix;
};
var useDefaultPartitionInfo = () => {
  setPartitionInfo(partitions_default, "");
};
var getUserAgentPrefix = () => selectedUserAgentPrefix;

// node_modules/.pnpm/@aws-sdk+util-endpoints@3.408.0/node_modules/@aws-sdk/util-endpoints/dist-es/lib/isIpAddress.js
var IP_V4_REGEX = new RegExp(`^(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]\\d|\\d)(?:\\.(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]\\d|\\d)){3}$`);
var isIpAddress = (value) => IP_V4_REGEX.test(value) || value.startsWith("[") && value.endsWith("]");

// node_modules/.pnpm/@aws-sdk+util-endpoints@3.408.0/node_modules/@aws-sdk/util-endpoints/dist-es/debug/debugId.js
var debugId = "endpoints";

// node_modules/.pnpm/@aws-sdk+util-endpoints@3.408.0/node_modules/@aws-sdk/util-endpoints/dist-es/debug/toDebugString.js
function toDebugString(input) {
  if (typeof input !== "object" || input == null) {
    return input;
  }
  if ("ref" in input) {
    return `$${toDebugString(input.ref)}`;
  }
  if ("fn" in input) {
    return `${input.fn}(${(input.argv || []).map(toDebugString).join(", ")})`;
  }
  return JSON.stringify(input, null, 2);
}

// node_modules/.pnpm/@aws-sdk+util-endpoints@3.408.0/node_modules/@aws-sdk/util-endpoints/dist-es/types/EndpointError.js
var EndpointError = class extends Error {
  constructor(message) {
    super(message);
    this.name = "EndpointError";
  }
};

// node_modules/.pnpm/@aws-sdk+util-endpoints@3.408.0/node_modules/@aws-sdk/util-endpoints/dist-es/lib/index.js
var lib_exports = {};
__export(lib_exports, {
  aws: () => aws_exports,
  booleanEquals: () => booleanEquals,
  getAttr: () => getAttr,
  isSet: () => isSet,
  isValidHostLabel: () => isValidHostLabel,
  not: () => not,
  parseURL: () => parseURL,
  stringEquals: () => stringEquals,
  substring: () => substring,
  uriEncode: () => uriEncode
});

// node_modules/.pnpm/@aws-sdk+util-endpoints@3.408.0/node_modules/@aws-sdk/util-endpoints/dist-es/lib/aws/index.js
var aws_exports = {};
__export(aws_exports, {
  getUserAgentPrefix: () => getUserAgentPrefix,
  isVirtualHostableS3Bucket: () => isVirtualHostableS3Bucket,
  parseArn: () => parseArn,
  partition: () => partition,
  setPartitionInfo: () => setPartitionInfo,
  useDefaultPartitionInfo: () => useDefaultPartitionInfo
});

// node_modules/.pnpm/@aws-sdk+util-endpoints@3.408.0/node_modules/@aws-sdk/util-endpoints/dist-es/lib/isValidHostLabel.js
var VALID_HOST_LABEL_REGEX = new RegExp(`^(?!.*-$)(?!-)[a-zA-Z0-9-]{1,63}$`);
var isValidHostLabel = (value, allowSubDomains = false) => {
  if (!allowSubDomains) {
    return VALID_HOST_LABEL_REGEX.test(value);
  }
  const labels = value.split(".");
  for (const label of labels) {
    if (!isValidHostLabel(label)) {
      return false;
    }
  }
  return true;
};

// node_modules/.pnpm/@aws-sdk+util-endpoints@3.408.0/node_modules/@aws-sdk/util-endpoints/dist-es/lib/aws/isVirtualHostableS3Bucket.js
var isVirtualHostableS3Bucket = (value, allowSubDomains = false) => {
  if (allowSubDomains) {
    for (const label of value.split(".")) {
      if (!isVirtualHostableS3Bucket(label)) {
        return false;
      }
    }
    return true;
  }
  if (!isValidHostLabel(value)) {
    return false;
  }
  if (value.length < 3 || value.length > 63) {
    return false;
  }
  if (value !== value.toLowerCase()) {
    return false;
  }
  if (isIpAddress(value)) {
    return false;
  }
  return true;
};

// node_modules/.pnpm/@aws-sdk+util-endpoints@3.408.0/node_modules/@aws-sdk/util-endpoints/dist-es/lib/aws/parseArn.js
var parseArn = (value) => {
  const segments = value.split(":");
  if (segments.length < 6)
    return null;
  const [arn, partition2, service, region, accountId, ...resourceId] = segments;
  if (arn !== "arn" || partition2 === "" || service === "" || resourceId[0] === "")
    return null;
  return {
    partition: partition2,
    service,
    region,
    accountId,
    resourceId: resourceId[0].includes("/") ? resourceId[0].split("/") : resourceId
  };
};

// node_modules/.pnpm/@aws-sdk+util-endpoints@3.408.0/node_modules/@aws-sdk/util-endpoints/dist-es/lib/booleanEquals.js
var booleanEquals = (value1, value2) => value1 === value2;

// node_modules/.pnpm/@aws-sdk+util-endpoints@3.408.0/node_modules/@aws-sdk/util-endpoints/dist-es/lib/getAttrPathList.js
var getAttrPathList = (path) => {
  const parts = path.split(".");
  const pathList = [];
  for (const part of parts) {
    const squareBracketIndex = part.indexOf("[");
    if (squareBracketIndex !== -1) {
      if (part.indexOf("]") !== part.length - 1) {
        throw new EndpointError(`Path: '${path}' does not end with ']'`);
      }
      const arrayIndex = part.slice(squareBracketIndex + 1, -1);
      if (Number.isNaN(parseInt(arrayIndex))) {
        throw new EndpointError(`Invalid array index: '${arrayIndex}' in path: '${path}'`);
      }
      if (squareBracketIndex !== 0) {
        pathList.push(part.slice(0, squareBracketIndex));
      }
      pathList.push(arrayIndex);
    } else {
      pathList.push(part);
    }
  }
  return pathList;
};

// node_modules/.pnpm/@aws-sdk+util-endpoints@3.408.0/node_modules/@aws-sdk/util-endpoints/dist-es/lib/getAttr.js
var getAttr = (value, path) => getAttrPathList(path).reduce((acc, index) => {
  if (typeof acc !== "object") {
    throw new EndpointError(`Index '${index}' in '${path}' not found in '${JSON.stringify(value)}'`);
  } else if (Array.isArray(acc)) {
    return acc[parseInt(index)];
  }
  return acc[index];
}, value);

// node_modules/.pnpm/@aws-sdk+util-endpoints@3.408.0/node_modules/@aws-sdk/util-endpoints/dist-es/lib/isSet.js
var isSet = (value) => value != null;

// node_modules/.pnpm/@aws-sdk+util-endpoints@3.408.0/node_modules/@aws-sdk/util-endpoints/dist-es/lib/not.js
var not = (value) => !value;

// node_modules/.pnpm/@aws-sdk+types@3.408.0/node_modules/@aws-sdk/types/dist-es/dns.js
var HostAddressType;
(function(HostAddressType2) {
  HostAddressType2["AAAA"] = "AAAA";
  HostAddressType2["A"] = "A";
})(HostAddressType || (HostAddressType = {}));

// node_modules/.pnpm/@aws-sdk+util-endpoints@3.408.0/node_modules/@aws-sdk/util-endpoints/dist-es/lib/parseURL.js
var DEFAULT_PORTS = {
  [EndpointURLScheme.HTTP]: 80,
  [EndpointURLScheme.HTTPS]: 443
};
var parseURL = (value) => {
  const whatwgURL = (() => {
    try {
      if (value instanceof URL) {
        return value;
      }
      if (typeof value === "object" && "hostname" in value) {
        const { hostname: hostname2, port, protocol: protocol2 = "", path = "", query = {} } = value;
        const url = new URL(`${protocol2}//${hostname2}${port ? `:${port}` : ""}${path}`);
        url.search = Object.entries(query).map(([k5, v3]) => `${k5}=${v3}`).join("&");
        return url;
      }
      return new URL(value);
    } catch (error) {
      return null;
    }
  })();
  if (!whatwgURL) {
    console.error(`Unable to parse ${JSON.stringify(value)} as a whatwg URL.`);
    return null;
  }
  const urlString = whatwgURL.href;
  const { host, hostname, pathname, protocol, search } = whatwgURL;
  if (search) {
    return null;
  }
  const scheme = protocol.slice(0, -1);
  if (!Object.values(EndpointURLScheme).includes(scheme)) {
    return null;
  }
  const isIp = isIpAddress(hostname);
  const inputContainsDefaultPort = urlString.includes(`${host}:${DEFAULT_PORTS[scheme]}`) || typeof value === "string" && value.includes(`${host}:${DEFAULT_PORTS[scheme]}`);
  const authority = `${host}${inputContainsDefaultPort ? `:${DEFAULT_PORTS[scheme]}` : ``}`;
  return {
    scheme,
    authority,
    path: pathname,
    normalizedPath: pathname.endsWith("/") ? pathname : `${pathname}/`,
    isIp
  };
};

// node_modules/.pnpm/@aws-sdk+util-endpoints@3.408.0/node_modules/@aws-sdk/util-endpoints/dist-es/lib/stringEquals.js
var stringEquals = (value1, value2) => value1 === value2;

// node_modules/.pnpm/@aws-sdk+util-endpoints@3.408.0/node_modules/@aws-sdk/util-endpoints/dist-es/lib/substring.js
var substring = (input, start, stop, reverse) => {
  if (start >= stop || input.length < stop) {
    return null;
  }
  if (!reverse) {
    return input.substring(start, stop);
  }
  return input.substring(input.length - stop, input.length - start);
};

// node_modules/.pnpm/@aws-sdk+util-endpoints@3.408.0/node_modules/@aws-sdk/util-endpoints/dist-es/lib/uriEncode.js
var uriEncode = (value) => encodeURIComponent(value).replace(/[!*'()]/g, (c5) => `%${c5.charCodeAt(0).toString(16).toUpperCase()}`);

// node_modules/.pnpm/@aws-sdk+util-endpoints@3.408.0/node_modules/@aws-sdk/util-endpoints/dist-es/utils/evaluateTemplate.js
var evaluateTemplate = (template, options) => {
  const evaluatedTemplateArr = [];
  const templateContext = {
    ...options.endpointParams,
    ...options.referenceRecord
  };
  let currentIndex = 0;
  while (currentIndex < template.length) {
    const openingBraceIndex = template.indexOf("{", currentIndex);
    if (openingBraceIndex === -1) {
      evaluatedTemplateArr.push(template.slice(currentIndex));
      break;
    }
    evaluatedTemplateArr.push(template.slice(currentIndex, openingBraceIndex));
    const closingBraceIndex = template.indexOf("}", openingBraceIndex);
    if (closingBraceIndex === -1) {
      evaluatedTemplateArr.push(template.slice(openingBraceIndex));
      break;
    }
    if (template[openingBraceIndex + 1] === "{" && template[closingBraceIndex + 1] === "}") {
      evaluatedTemplateArr.push(template.slice(openingBraceIndex + 1, closingBraceIndex));
      currentIndex = closingBraceIndex + 2;
    }
    const parameterName = template.substring(openingBraceIndex + 1, closingBraceIndex);
    if (parameterName.includes("#")) {
      const [refName, attrName] = parameterName.split("#");
      evaluatedTemplateArr.push(getAttr(templateContext[refName], attrName));
    } else {
      evaluatedTemplateArr.push(templateContext[parameterName]);
    }
    currentIndex = closingBraceIndex + 1;
  }
  return evaluatedTemplateArr.join("");
};

// node_modules/.pnpm/@aws-sdk+util-endpoints@3.408.0/node_modules/@aws-sdk/util-endpoints/dist-es/utils/getReferenceValue.js
var getReferenceValue = ({ ref }, options) => {
  const referenceRecord = {
    ...options.endpointParams,
    ...options.referenceRecord
  };
  return referenceRecord[ref];
};

// node_modules/.pnpm/@aws-sdk+util-endpoints@3.408.0/node_modules/@aws-sdk/util-endpoints/dist-es/utils/evaluateExpression.js
var evaluateExpression = (obj, keyName, options) => {
  if (typeof obj === "string") {
    return evaluateTemplate(obj, options);
  } else if (obj["fn"]) {
    return callFunction(obj, options);
  } else if (obj["ref"]) {
    return getReferenceValue(obj, options);
  }
  throw new EndpointError(`'${keyName}': ${String(obj)} is not a string, function or reference.`);
};

// node_modules/.pnpm/@aws-sdk+util-endpoints@3.408.0/node_modules/@aws-sdk/util-endpoints/dist-es/utils/callFunction.js
var callFunction = ({ fn, argv }, options) => {
  const evaluatedArgs = argv.map((arg) => ["boolean", "number"].includes(typeof arg) ? arg : evaluateExpression(arg, "arg", options));
  return fn.split(".").reduce((acc, key) => acc[key], lib_exports)(...evaluatedArgs);
};

// node_modules/.pnpm/@aws-sdk+util-endpoints@3.408.0/node_modules/@aws-sdk/util-endpoints/dist-es/utils/evaluateCondition.js
var evaluateCondition = ({ assign, ...fnArgs }, options) => {
  var _a, _b;
  if (assign && assign in options.referenceRecord) {
    throw new EndpointError(`'${assign}' is already defined in Reference Record.`);
  }
  const value = callFunction(fnArgs, options);
  (_b = (_a = options.logger) == null ? void 0 : _a.debug) == null ? void 0 : _b.call(_a, debugId, `evaluateCondition: ${toDebugString(fnArgs)} = ${toDebugString(value)}`);
  return {
    result: value === "" ? true : !!value,
    ...assign != null && { toAssign: { name: assign, value } }
  };
};

// node_modules/.pnpm/@aws-sdk+util-endpoints@3.408.0/node_modules/@aws-sdk/util-endpoints/dist-es/utils/evaluateConditions.js
var evaluateConditions = (conditions = [], options) => {
  var _a, _b;
  const conditionsReferenceRecord = {};
  for (const condition of conditions) {
    const { result, toAssign } = evaluateCondition(condition, {
      ...options,
      referenceRecord: {
        ...options.referenceRecord,
        ...conditionsReferenceRecord
      }
    });
    if (!result) {
      return { result };
    }
    if (toAssign) {
      conditionsReferenceRecord[toAssign.name] = toAssign.value;
      (_b = (_a = options.logger) == null ? void 0 : _a.debug) == null ? void 0 : _b.call(_a, debugId, `assign: ${toAssign.name} := ${toDebugString(toAssign.value)}`);
    }
  }
  return { result: true, referenceRecord: conditionsReferenceRecord };
};

// node_modules/.pnpm/@aws-sdk+util-endpoints@3.408.0/node_modules/@aws-sdk/util-endpoints/dist-es/utils/getEndpointHeaders.js
var getEndpointHeaders = (headers, options) => Object.entries(headers).reduce((acc, [headerKey, headerVal]) => ({
  ...acc,
  [headerKey]: headerVal.map((headerValEntry) => {
    const processedExpr = evaluateExpression(headerValEntry, "Header value entry", options);
    if (typeof processedExpr !== "string") {
      throw new EndpointError(`Header '${headerKey}' value '${processedExpr}' is not a string`);
    }
    return processedExpr;
  })
}), {});

// node_modules/.pnpm/@aws-sdk+util-endpoints@3.408.0/node_modules/@aws-sdk/util-endpoints/dist-es/utils/getEndpointProperty.js
var getEndpointProperty = (property, options) => {
  if (Array.isArray(property)) {
    return property.map((propertyEntry) => getEndpointProperty(propertyEntry, options));
  }
  switch (typeof property) {
    case "string":
      return evaluateTemplate(property, options);
    case "object":
      if (property === null) {
        throw new EndpointError(`Unexpected endpoint property: ${property}`);
      }
      return getEndpointProperties(property, options);
    case "boolean":
      return property;
    default:
      throw new EndpointError(`Unexpected endpoint property type: ${typeof property}`);
  }
};

// node_modules/.pnpm/@aws-sdk+util-endpoints@3.408.0/node_modules/@aws-sdk/util-endpoints/dist-es/utils/getEndpointProperties.js
var getEndpointProperties = (properties, options) => Object.entries(properties).reduce((acc, [propertyKey, propertyVal]) => ({
  ...acc,
  [propertyKey]: getEndpointProperty(propertyVal, options)
}), {});

// node_modules/.pnpm/@aws-sdk+util-endpoints@3.408.0/node_modules/@aws-sdk/util-endpoints/dist-es/utils/getEndpointUrl.js
var getEndpointUrl = (endpointUrl, options) => {
  const expression = evaluateExpression(endpointUrl, "Endpoint URL", options);
  if (typeof expression === "string") {
    try {
      return new URL(expression);
    } catch (error) {
      console.error(`Failed to construct URL with ${expression}`, error);
      throw error;
    }
  }
  throw new EndpointError(`Endpoint URL must be a string, got ${typeof expression}`);
};

// node_modules/.pnpm/@aws-sdk+util-endpoints@3.408.0/node_modules/@aws-sdk/util-endpoints/dist-es/utils/evaluateEndpointRule.js
var evaluateEndpointRule = (endpointRule, options) => {
  var _a, _b;
  const { conditions, endpoint } = endpointRule;
  const { result, referenceRecord } = evaluateConditions(conditions, options);
  if (!result) {
    return;
  }
  const endpointRuleOptions = {
    ...options,
    referenceRecord: { ...options.referenceRecord, ...referenceRecord }
  };
  const { url, properties, headers } = endpoint;
  (_b = (_a = options.logger) == null ? void 0 : _a.debug) == null ? void 0 : _b.call(_a, debugId, `Resolving endpoint from template: ${toDebugString(endpoint)}`);
  return {
    ...headers != void 0 && {
      headers: getEndpointHeaders(headers, endpointRuleOptions)
    },
    ...properties != void 0 && {
      properties: getEndpointProperties(properties, endpointRuleOptions)
    },
    url: getEndpointUrl(url, endpointRuleOptions)
  };
};

// node_modules/.pnpm/@aws-sdk+util-endpoints@3.408.0/node_modules/@aws-sdk/util-endpoints/dist-es/utils/evaluateErrorRule.js
var evaluateErrorRule = (errorRule, options) => {
  const { conditions, error } = errorRule;
  const { result, referenceRecord } = evaluateConditions(conditions, options);
  if (!result) {
    return;
  }
  throw new EndpointError(evaluateExpression(error, "Error", {
    ...options,
    referenceRecord: { ...options.referenceRecord, ...referenceRecord }
  }));
};

// node_modules/.pnpm/@aws-sdk+util-endpoints@3.408.0/node_modules/@aws-sdk/util-endpoints/dist-es/utils/evaluateTreeRule.js
var evaluateTreeRule = (treeRule, options) => {
  const { conditions, rules } = treeRule;
  const { result, referenceRecord } = evaluateConditions(conditions, options);
  if (!result) {
    return;
  }
  return evaluateRules(rules, {
    ...options,
    referenceRecord: { ...options.referenceRecord, ...referenceRecord }
  });
};

// node_modules/.pnpm/@aws-sdk+util-endpoints@3.408.0/node_modules/@aws-sdk/util-endpoints/dist-es/utils/evaluateRules.js
var evaluateRules = (rules, options) => {
  for (const rule of rules) {
    if (rule.type === "endpoint") {
      const endpointOrUndefined = evaluateEndpointRule(rule, options);
      if (endpointOrUndefined) {
        return endpointOrUndefined;
      }
    } else if (rule.type === "error") {
      evaluateErrorRule(rule, options);
    } else if (rule.type === "tree") {
      const endpointOrUndefined = evaluateTreeRule(rule, options);
      if (endpointOrUndefined) {
        return endpointOrUndefined;
      }
    } else {
      throw new EndpointError(`Unknown endpoint rule: ${rule}`);
    }
  }
  throw new EndpointError(`Rules evaluation failed`);
};

// node_modules/.pnpm/@aws-sdk+util-endpoints@3.408.0/node_modules/@aws-sdk/util-endpoints/dist-es/resolveEndpoint.js
var resolveEndpoint = (ruleSetObject, options) => {
  var _a, _b, _c, _d, _e, _f;
  const { endpointParams, logger: logger2 } = options;
  const { parameters, rules } = ruleSetObject;
  (_b = (_a = options.logger) == null ? void 0 : _a.debug) == null ? void 0 : _b.call(_a, `${debugId} Initial EndpointParams: ${toDebugString(endpointParams)}`);
  const paramsWithDefault = Object.entries(parameters).filter(([, v3]) => v3.default != null).map(([k5, v3]) => [k5, v3.default]);
  if (paramsWithDefault.length > 0) {
    for (const [paramKey, paramDefaultValue] of paramsWithDefault) {
      endpointParams[paramKey] = (_c = endpointParams[paramKey]) != null ? _c : paramDefaultValue;
    }
  }
  const requiredParams = Object.entries(parameters).filter(([, v3]) => v3.required).map(([k5]) => k5);
  for (const requiredParam of requiredParams) {
    if (endpointParams[requiredParam] == null) {
      throw new EndpointError(`Missing required parameter: '${requiredParam}'`);
    }
  }
  const endpoint = evaluateRules(rules, { endpointParams, logger: logger2, referenceRecord: {} });
  if ((_d = options.endpointParams) == null ? void 0 : _d.Endpoint) {
    try {
      const givenEndpoint = new URL(options.endpointParams.Endpoint);
      const { protocol, port } = givenEndpoint;
      endpoint.url.protocol = protocol;
      endpoint.url.port = port;
    } catch (e5) {
    }
  }
  (_f = (_e = options.logger) == null ? void 0 : _e.debug) == null ? void 0 : _f.call(_e, `${debugId} Resolved endpoint: ${toDebugString(endpoint)}`);
  return endpoint;
};

// node_modules/.pnpm/@aws-sdk+middleware-user-agent@3.408.0/node_modules/@aws-sdk/middleware-user-agent/dist-es/constants.js
var USER_AGENT = "user-agent";
var X_AMZ_USER_AGENT = "x-amz-user-agent";
var SPACE = " ";
var UA_NAME_SEPARATOR = "/";
var UA_NAME_ESCAPE_REGEX = /[^\!\$\%\&\'\*\+\-\.\^\_\`\|\~\d\w]/g;
var UA_VALUE_ESCAPE_REGEX = /[^\!\$\%\&\'\*\+\-\.\^\_\`\|\~\d\w\#]/g;
var UA_ESCAPE_CHAR = "-";

// node_modules/.pnpm/@aws-sdk+middleware-user-agent@3.408.0/node_modules/@aws-sdk/middleware-user-agent/dist-es/user-agent-middleware.js
var userAgentMiddleware = (options) => (next, context) => async (args) => {
  var _a, _b;
  const { request: request2 } = args;
  if (!HttpRequest.isInstance(request2))
    return next(args);
  const { headers } = request2;
  const userAgent = ((_a = context == null ? void 0 : context.userAgent) == null ? void 0 : _a.map(escapeUserAgent)) || [];
  const defaultUserAgent2 = (await options.defaultUserAgentProvider()).map(escapeUserAgent);
  const customUserAgent = ((_b = options == null ? void 0 : options.customUserAgent) == null ? void 0 : _b.map(escapeUserAgent)) || [];
  const prefix = getUserAgentPrefix();
  const sdkUserAgentValue = (prefix ? [prefix] : []).concat([...defaultUserAgent2, ...userAgent, ...customUserAgent]).join(SPACE);
  const normalUAValue = [
    ...defaultUserAgent2.filter((section) => section.startsWith("aws-sdk-")),
    ...customUserAgent
  ].join(SPACE);
  if (options.runtime !== "browser") {
    if (normalUAValue) {
      headers[X_AMZ_USER_AGENT] = headers[X_AMZ_USER_AGENT] ? `${headers[USER_AGENT]} ${normalUAValue}` : normalUAValue;
    }
    headers[USER_AGENT] = sdkUserAgentValue;
  } else {
    headers[X_AMZ_USER_AGENT] = sdkUserAgentValue;
  }
  return next({
    ...args,
    request: request2
  });
};
var escapeUserAgent = (userAgentPair) => {
  var _a;
  const name = userAgentPair[0].split(UA_NAME_SEPARATOR).map((part) => part.replace(UA_NAME_ESCAPE_REGEX, UA_ESCAPE_CHAR)).join(UA_NAME_SEPARATOR);
  const version = (_a = userAgentPair[1]) == null ? void 0 : _a.replace(UA_VALUE_ESCAPE_REGEX, UA_ESCAPE_CHAR);
  const prefixSeparatorIndex = name.indexOf(UA_NAME_SEPARATOR);
  const prefix = name.substring(0, prefixSeparatorIndex);
  let uaName = name.substring(prefixSeparatorIndex + 1);
  if (prefix === "api") {
    uaName = uaName.toLowerCase();
  }
  return [prefix, uaName, version].filter((item) => item && item.length > 0).reduce((acc, item, index) => {
    switch (index) {
      case 0:
        return item;
      case 1:
        return `${acc}/${item}`;
      default:
        return `${acc}#${item}`;
    }
  }, "");
};
var getUserAgentMiddlewareOptions = {
  name: "getUserAgentMiddleware",
  step: "build",
  priority: "low",
  tags: ["SET_USER_AGENT", "USER_AGENT"],
  override: true
};
var getUserAgentPlugin = (config) => ({
  applyToStack: (clientStack) => {
    clientStack.add(userAgentMiddleware(config), getUserAgentMiddlewareOptions);
  }
});

// node_modules/.pnpm/@smithy+util-config-provider@2.0.0/node_modules/@smithy/util-config-provider/dist-es/booleanSelector.js
var SelectorType;
(function(SelectorType2) {
  SelectorType2["ENV"] = "env";
  SelectorType2["CONFIG"] = "shared config entry";
})(SelectorType || (SelectorType = {}));
var booleanSelector = (obj, key, type) => {
  if (!(key in obj))
    return void 0;
  if (obj[key] === "true")
    return true;
  if (obj[key] === "false")
    return false;
  throw new Error(`Cannot load ${type} "${key}". Expected "true" or "false", got ${obj[key]}.`);
};

// node_modules/.pnpm/@smithy+config-resolver@2.0.7/node_modules/@smithy/config-resolver/dist-es/endpointsConfig/NodeUseDualstackEndpointConfigOptions.js
var ENV_USE_DUALSTACK_ENDPOINT = "AWS_USE_DUALSTACK_ENDPOINT";
var CONFIG_USE_DUALSTACK_ENDPOINT = "use_dualstack_endpoint";
var NODE_USE_DUALSTACK_ENDPOINT_CONFIG_OPTIONS = {
  environmentVariableSelector: (env2) => booleanSelector(env2, ENV_USE_DUALSTACK_ENDPOINT, SelectorType.ENV),
  configFileSelector: (profile) => booleanSelector(profile, CONFIG_USE_DUALSTACK_ENDPOINT, SelectorType.CONFIG),
  default: false
};

// node_modules/.pnpm/@smithy+config-resolver@2.0.7/node_modules/@smithy/config-resolver/dist-es/endpointsConfig/NodeUseFipsEndpointConfigOptions.js
var ENV_USE_FIPS_ENDPOINT = "AWS_USE_FIPS_ENDPOINT";
var CONFIG_USE_FIPS_ENDPOINT = "use_fips_endpoint";
var NODE_USE_FIPS_ENDPOINT_CONFIG_OPTIONS = {
  environmentVariableSelector: (env2) => booleanSelector(env2, ENV_USE_FIPS_ENDPOINT, SelectorType.ENV),
  configFileSelector: (profile) => booleanSelector(profile, CONFIG_USE_FIPS_ENDPOINT, SelectorType.CONFIG),
  default: false
};

// node_modules/.pnpm/@smithy+config-resolver@2.0.7/node_modules/@smithy/config-resolver/dist-es/regionConfig/config.js
var REGION_ENV_NAME = "AWS_REGION";
var REGION_INI_NAME = "region";
var NODE_REGION_CONFIG_OPTIONS = {
  environmentVariableSelector: (env2) => env2[REGION_ENV_NAME],
  configFileSelector: (profile) => profile[REGION_INI_NAME],
  default: () => {
    throw new Error("Region is missing");
  }
};
var NODE_REGION_CONFIG_FILE_OPTIONS = {
  preferredFile: "credentials"
};

// node_modules/.pnpm/@smithy+config-resolver@2.0.7/node_modules/@smithy/config-resolver/dist-es/regionConfig/isFipsRegion.js
var isFipsRegion = (region) => typeof region === "string" && (region.startsWith("fips-") || region.endsWith("-fips"));

// node_modules/.pnpm/@smithy+config-resolver@2.0.7/node_modules/@smithy/config-resolver/dist-es/regionConfig/getRealRegion.js
var getRealRegion = (region) => isFipsRegion(region) ? ["fips-aws-global", "aws-fips"].includes(region) ? "us-east-1" : region.replace(/fips-(dkr-|prod-)?|-fips/, "") : region;

// node_modules/.pnpm/@smithy+config-resolver@2.0.7/node_modules/@smithy/config-resolver/dist-es/regionConfig/resolveRegionConfig.js
var resolveRegionConfig = (input) => {
  const { region, useFipsEndpoint } = input;
  if (!region) {
    throw new Error("Region is missing");
  }
  return {
    ...input,
    region: async () => {
      if (typeof region === "string") {
        return getRealRegion(region);
      }
      const providedRegion = await region();
      return getRealRegion(providedRegion);
    },
    useFipsEndpoint: async () => {
      const providedRegion = typeof region === "string" ? region : await region();
      if (isFipsRegion(providedRegion)) {
        return true;
      }
      return typeof useFipsEndpoint !== "function" ? Promise.resolve(!!useFipsEndpoint) : useFipsEndpoint();
    }
  };
};

// node_modules/.pnpm/@smithy+eventstream-serde-config-resolver@2.0.6/node_modules/@smithy/eventstream-serde-config-resolver/dist-es/EventStreamSerdeConfig.js
var resolveEventStreamSerdeConfig = (input) => ({
  ...input,
  eventStreamMarshaller: input.eventStreamSerdeProvider(input)
});

// node_modules/.pnpm/@smithy+protocol-http@3.0.2/node_modules/@smithy/protocol-http/dist-es/httpRequest.js
var HttpRequest2 = class _HttpRequest {
  constructor(options) {
    this.method = options.method || "GET";
    this.hostname = options.hostname || "localhost";
    this.port = options.port;
    this.query = options.query || {};
    this.headers = options.headers || {};
    this.body = options.body;
    this.protocol = options.protocol ? options.protocol.slice(-1) !== ":" ? `${options.protocol}:` : options.protocol : "https:";
    this.path = options.path ? options.path.charAt(0) !== "/" ? `/${options.path}` : options.path : "/";
    this.username = options.username;
    this.password = options.password;
    this.fragment = options.fragment;
  }
  static isInstance(request2) {
    if (!request2)
      return false;
    const req = request2;
    return "method" in req && "protocol" in req && "hostname" in req && "path" in req && typeof req["query"] === "object" && typeof req["headers"] === "object";
  }
  clone() {
    const cloned = new _HttpRequest({
      ...this,
      headers: { ...this.headers }
    });
    if (cloned.query)
      cloned.query = cloneQuery3(cloned.query);
    return cloned;
  }
};
function cloneQuery3(query) {
  return Object.keys(query).reduce((carry, paramName) => {
    const param = query[paramName];
    return {
      ...carry,
      [paramName]: Array.isArray(param) ? [...param] : param
    };
  }, {});
}

// node_modules/.pnpm/@smithy+protocol-http@3.0.2/node_modules/@smithy/protocol-http/dist-es/httpResponse.js
var HttpResponse2 = class {
  constructor(options) {
    this.statusCode = options.statusCode;
    this.reason = options.reason;
    this.headers = options.headers || {};
    this.body = options.body;
  }
  static isInstance(response) {
    if (!response)
      return false;
    const resp = response;
    return typeof resp.statusCode === "number" && typeof resp.headers === "object";
  }
};

// node_modules/.pnpm/@smithy+middleware-content-length@2.0.8/node_modules/@smithy/middleware-content-length/dist-es/index.js
var CONTENT_LENGTH_HEADER2 = "content-length";
function contentLengthMiddleware(bodyLengthChecker) {
  return (next) => async (args) => {
    const request2 = args.request;
    if (HttpRequest2.isInstance(request2)) {
      const { body, headers } = request2;
      if (body && Object.keys(headers).map((str) => str.toLowerCase()).indexOf(CONTENT_LENGTH_HEADER2) === -1) {
        try {
          const length = bodyLengthChecker(body);
          request2.headers = {
            ...request2.headers,
            [CONTENT_LENGTH_HEADER2]: String(length)
          };
        } catch (error) {
        }
      }
    }
    return next({
      ...args,
      request: request2
    });
  };
}
var contentLengthMiddlewareOptions = {
  step: "build",
  tags: ["SET_CONTENT_LENGTH", "CONTENT_LENGTH"],
  name: "contentLengthMiddleware",
  override: true
};
var getContentLengthPlugin = (options) => ({
  applyToStack: (clientStack) => {
    clientStack.add(contentLengthMiddleware(options.bodyLengthChecker), contentLengthMiddlewareOptions);
  }
});

// node_modules/.pnpm/@smithy+middleware-endpoint@2.0.6/node_modules/@smithy/middleware-endpoint/dist-es/service-customizations/s3.js
var resolveParamsForS3 = async (endpointParams) => {
  const bucket = (endpointParams == null ? void 0 : endpointParams.Bucket) || "";
  if (typeof endpointParams.Bucket === "string") {
    endpointParams.Bucket = bucket.replace(/#/g, encodeURIComponent("#")).replace(/\?/g, encodeURIComponent("?"));
  }
  if (isArnBucketName(bucket)) {
    if (endpointParams.ForcePathStyle === true) {
      throw new Error("Path-style addressing cannot be used with ARN buckets");
    }
  } else if (!isDnsCompatibleBucketName(bucket) || bucket.indexOf(".") !== -1 && !String(endpointParams.Endpoint).startsWith("http:") || bucket.toLowerCase() !== bucket || bucket.length < 3) {
    endpointParams.ForcePathStyle = true;
  }
  if (endpointParams.DisableMultiRegionAccessPoints) {
    endpointParams.disableMultiRegionAccessPoints = true;
    endpointParams.DisableMRAP = true;
  }
  return endpointParams;
};
var DOMAIN_PATTERN = /^[a-z0-9][a-z0-9\.\-]{1,61}[a-z0-9]$/;
var IP_ADDRESS_PATTERN = /(\d+\.){3}\d+/;
var DOTS_PATTERN = /\.\./;
var isDnsCompatibleBucketName = (bucketName) => DOMAIN_PATTERN.test(bucketName) && !IP_ADDRESS_PATTERN.test(bucketName) && !DOTS_PATTERN.test(bucketName);
var isArnBucketName = (bucketName) => {
  const [arn, partition2, service, region, account, typeOrId] = bucketName.split(":");
  const isArn = arn === "arn" && bucketName.split(":").length >= 6;
  const isValidArn = [arn, partition2, service, account, typeOrId].filter(Boolean).length === 5;
  if (isArn && !isValidArn) {
    throw new Error(`Invalid ARN: ${bucketName} was an invalid ARN.`);
  }
  return arn === "arn" && !!partition2 && !!service && !!account && !!typeOrId;
};

// node_modules/.pnpm/@smithy+middleware-endpoint@2.0.6/node_modules/@smithy/middleware-endpoint/dist-es/adaptors/createConfigValueProvider.js
var createConfigValueProvider = (configKey, canonicalEndpointParamKey, config) => {
  const configProvider = async () => {
    var _a;
    const configValue = (_a = config[configKey]) != null ? _a : config[canonicalEndpointParamKey];
    if (typeof configValue === "function") {
      return configValue();
    }
    return configValue;
  };
  if (configKey === "endpoint" || canonicalEndpointParamKey === "endpoint") {
    return async () => {
      const endpoint = await configProvider();
      if (endpoint && typeof endpoint === "object") {
        if ("url" in endpoint) {
          return endpoint.url.href;
        }
        if ("hostname" in endpoint) {
          const { protocol, hostname, port, path } = endpoint;
          return `${protocol}//${hostname}${port ? ":" + port : ""}${path}`;
        }
      }
      return endpoint;
    };
  }
  return configProvider;
};

// node_modules/.pnpm/@smithy+middleware-endpoint@2.0.6/node_modules/@smithy/middleware-endpoint/dist-es/adaptors/getEndpointFromInstructions.js
var getEndpointFromInstructions = async (commandInput, instructionsSupplier, clientConfig, context) => {
  const endpointParams = await resolveParams(commandInput, instructionsSupplier, clientConfig);
  if (typeof clientConfig.endpointProvider !== "function") {
    throw new Error("config.endpointProvider is not set.");
  }
  const endpoint = clientConfig.endpointProvider(endpointParams, context);
  return endpoint;
};
var resolveParams = async (commandInput, instructionsSupplier, clientConfig) => {
  var _a;
  const endpointParams = {};
  const instructions = ((_a = instructionsSupplier == null ? void 0 : instructionsSupplier.getEndpointParameterInstructions) == null ? void 0 : _a.call(instructionsSupplier)) || {};
  for (const [name, instruction] of Object.entries(instructions)) {
    switch (instruction.type) {
      case "staticContextParams":
        endpointParams[name] = instruction.value;
        break;
      case "contextParams":
        endpointParams[name] = commandInput[instruction.name];
        break;
      case "clientContextParams":
      case "builtInParams":
        endpointParams[name] = await createConfigValueProvider(instruction.name, name, clientConfig)();
        break;
      default:
        throw new Error("Unrecognized endpoint parameter instruction: " + JSON.stringify(instruction));
    }
  }
  if (Object.keys(instructions).length === 0) {
    Object.assign(endpointParams, clientConfig);
  }
  if (String(clientConfig.serviceId).toLowerCase() === "s3") {
    await resolveParamsForS3(endpointParams);
  }
  return endpointParams;
};

// node_modules/.pnpm/@smithy+querystring-parser@2.0.6/node_modules/@smithy/querystring-parser/dist-es/index.js
function parseQueryString(querystring) {
  const query = {};
  querystring = querystring.replace(/^\?/, "");
  if (querystring) {
    for (const pair of querystring.split("&")) {
      let [key, value = null] = pair.split("=");
      key = decodeURIComponent(key);
      if (value) {
        value = decodeURIComponent(value);
      }
      if (!(key in query)) {
        query[key] = value;
      } else if (Array.isArray(query[key])) {
        query[key].push(value);
      } else {
        query[key] = [query[key], value];
      }
    }
  }
  return query;
}

// node_modules/.pnpm/@smithy+url-parser@2.0.6/node_modules/@smithy/url-parser/dist-es/index.js
var parseUrl = (url) => {
  if (typeof url === "string") {
    return parseUrl(new URL(url));
  }
  const { hostname, pathname, port, protocol, search } = url;
  let query;
  if (search) {
    query = parseQueryString(search);
  }
  return {
    hostname,
    port: port ? parseInt(port) : void 0,
    protocol,
    path: pathname,
    query
  };
};

// node_modules/.pnpm/@smithy+middleware-endpoint@2.0.6/node_modules/@smithy/middleware-endpoint/dist-es/adaptors/toEndpointV1.js
var toEndpointV1 = (endpoint) => {
  if (typeof endpoint === "object") {
    if ("url" in endpoint) {
      return parseUrl(endpoint.url);
    }
    return endpoint;
  }
  return parseUrl(endpoint);
};

// node_modules/.pnpm/@smithy+middleware-endpoint@2.0.6/node_modules/@smithy/middleware-endpoint/dist-es/endpointMiddleware.js
var endpointMiddleware = ({ config, instructions }) => {
  return (next, context) => async (args) => {
    var _a, _b;
    const endpoint = await getEndpointFromInstructions(args.input, {
      getEndpointParameterInstructions() {
        return instructions;
      }
    }, { ...config }, context);
    context.endpointV2 = endpoint;
    context.authSchemes = (_a = endpoint.properties) == null ? void 0 : _a.authSchemes;
    const authScheme = (_b = context.authSchemes) == null ? void 0 : _b[0];
    if (authScheme) {
      context["signing_region"] = authScheme.signingRegion;
      context["signing_service"] = authScheme.signingName;
    }
    return next({
      ...args
    });
  };
};

// node_modules/.pnpm/@smithy+middleware-serde@2.0.6/node_modules/@smithy/middleware-serde/dist-es/deserializerMiddleware.js
var deserializerMiddleware = (options, deserializer) => (next, context) => async (args) => {
  const { response } = await next(args);
  try {
    const parsed = await deserializer(response, options);
    return {
      response,
      output: parsed
    };
  } catch (error) {
    Object.defineProperty(error, "$response", {
      value: response
    });
    if (!("$metadata" in error)) {
      const hint = `Deserialization error: to see the raw response, inspect the hidden field {error}.$response on this object.`;
      error.message += "\n  " + hint;
    }
    throw error;
  }
};

// node_modules/.pnpm/@smithy+middleware-serde@2.0.6/node_modules/@smithy/middleware-serde/dist-es/serializerMiddleware.js
var serializerMiddleware = (options, serializer) => (next, context) => async (args) => {
  var _a;
  const endpoint = ((_a = context.endpointV2) == null ? void 0 : _a.url) && options.urlParser ? async () => options.urlParser(context.endpointV2.url) : options.endpoint;
  if (!endpoint) {
    throw new Error("No valid endpoint provider available.");
  }
  const request2 = await serializer(args.input, { ...options, endpoint });
  return next({
    ...args,
    request: request2
  });
};

// node_modules/.pnpm/@smithy+middleware-serde@2.0.6/node_modules/@smithy/middleware-serde/dist-es/serdePlugin.js
var deserializerMiddlewareOption = {
  name: "deserializerMiddleware",
  step: "deserialize",
  tags: ["DESERIALIZER"],
  override: true
};
var serializerMiddlewareOption = {
  name: "serializerMiddleware",
  step: "serialize",
  tags: ["SERIALIZER"],
  override: true
};
function getSerdePlugin(config, serializer, deserializer) {
  return {
    applyToStack: (commandStack) => {
      commandStack.add(deserializerMiddleware(config, deserializer), deserializerMiddlewareOption);
      commandStack.add(serializerMiddleware(config, serializer), serializerMiddlewareOption);
    }
  };
}

// node_modules/.pnpm/@smithy+middleware-endpoint@2.0.6/node_modules/@smithy/middleware-endpoint/dist-es/getEndpointPlugin.js
var endpointMiddlewareOptions = {
  step: "serialize",
  tags: ["ENDPOINT_PARAMETERS", "ENDPOINT_V2", "ENDPOINT"],
  name: "endpointV2Middleware",
  override: true,
  relation: "before",
  toMiddleware: serializerMiddlewareOption.name
};
var getEndpointPlugin = (config, instructions) => ({
  applyToStack: (clientStack) => {
    clientStack.addRelativeTo(endpointMiddleware({
      config,
      instructions
    }), endpointMiddlewareOptions);
  }
});

// node_modules/.pnpm/@smithy+middleware-endpoint@2.0.6/node_modules/@smithy/middleware-endpoint/dist-es/resolveEndpointConfig.js
var resolveEndpointConfig = (input) => {
  var _a, _b, _c;
  const tls = (_a = input.tls) != null ? _a : true;
  const { endpoint } = input;
  const customEndpointProvider = endpoint != null ? async () => toEndpointV1(await normalizeProvider(endpoint)()) : void 0;
  const isCustomEndpoint = !!endpoint;
  return {
    ...input,
    endpoint: customEndpointProvider,
    tls,
    isCustomEndpoint,
    useDualstackEndpoint: normalizeProvider((_b = input.useDualstackEndpoint) != null ? _b : false),
    useFipsEndpoint: normalizeProvider((_c = input.useFipsEndpoint) != null ? _c : false)
  };
};

// node_modules/.pnpm/@smithy+util-retry@2.0.0/node_modules/@smithy/util-retry/dist-es/config.js
var RETRY_MODES;
(function(RETRY_MODES2) {
  RETRY_MODES2["STANDARD"] = "standard";
  RETRY_MODES2["ADAPTIVE"] = "adaptive";
})(RETRY_MODES || (RETRY_MODES = {}));
var DEFAULT_MAX_ATTEMPTS = 3;
var DEFAULT_RETRY_MODE = RETRY_MODES.STANDARD;

// node_modules/.pnpm/@smithy+service-error-classification@2.0.0/node_modules/@smithy/service-error-classification/dist-es/constants.js
var THROTTLING_ERROR_CODES = [
  "BandwidthLimitExceeded",
  "EC2ThrottledException",
  "LimitExceededException",
  "PriorRequestNotComplete",
  "ProvisionedThroughputExceededException",
  "RequestLimitExceeded",
  "RequestThrottled",
  "RequestThrottledException",
  "SlowDown",
  "ThrottledException",
  "Throttling",
  "ThrottlingException",
  "TooManyRequestsException",
  "TransactionInProgressException"
];
var TRANSIENT_ERROR_CODES = ["TimeoutError", "RequestTimeout", "RequestTimeoutException"];
var TRANSIENT_ERROR_STATUS_CODES = [500, 502, 503, 504];
var NODEJS_TIMEOUT_ERROR_CODES = ["ECONNRESET", "ECONNREFUSED", "EPIPE", "ETIMEDOUT"];

// node_modules/.pnpm/@smithy+service-error-classification@2.0.0/node_modules/@smithy/service-error-classification/dist-es/index.js
var isThrottlingError = (error) => {
  var _a, _b;
  return ((_a = error.$metadata) == null ? void 0 : _a.httpStatusCode) === 429 || THROTTLING_ERROR_CODES.includes(error.name) || ((_b = error.$retryable) == null ? void 0 : _b.throttling) == true;
};
var isTransientError = (error) => {
  var _a;
  return TRANSIENT_ERROR_CODES.includes(error.name) || NODEJS_TIMEOUT_ERROR_CODES.includes((error == null ? void 0 : error.code) || "") || TRANSIENT_ERROR_STATUS_CODES.includes(((_a = error.$metadata) == null ? void 0 : _a.httpStatusCode) || 0);
};
var isServerError = (error) => {
  var _a;
  if (((_a = error.$metadata) == null ? void 0 : _a.httpStatusCode) !== void 0) {
    const statusCode = error.$metadata.httpStatusCode;
    if (500 <= statusCode && statusCode <= 599 && !isTransientError(error)) {
      return true;
    }
    return false;
  }
  return false;
};

// node_modules/.pnpm/@smithy+util-retry@2.0.0/node_modules/@smithy/util-retry/dist-es/DefaultRateLimiter.js
var DefaultRateLimiter = class {
  constructor(options) {
    var _a, _b, _c, _d, _e;
    this.currentCapacity = 0;
    this.enabled = false;
    this.lastMaxRate = 0;
    this.measuredTxRate = 0;
    this.requestCount = 0;
    this.lastTimestamp = 0;
    this.timeWindow = 0;
    this.beta = (_a = options == null ? void 0 : options.beta) != null ? _a : 0.7;
    this.minCapacity = (_b = options == null ? void 0 : options.minCapacity) != null ? _b : 1;
    this.minFillRate = (_c = options == null ? void 0 : options.minFillRate) != null ? _c : 0.5;
    this.scaleConstant = (_d = options == null ? void 0 : options.scaleConstant) != null ? _d : 0.4;
    this.smooth = (_e = options == null ? void 0 : options.smooth) != null ? _e : 0.8;
    const currentTimeInSeconds = this.getCurrentTimeInSeconds();
    this.lastThrottleTime = currentTimeInSeconds;
    this.lastTxRateBucket = Math.floor(this.getCurrentTimeInSeconds());
    this.fillRate = this.minFillRate;
    this.maxCapacity = this.minCapacity;
  }
  getCurrentTimeInSeconds() {
    return Date.now() / 1e3;
  }
  async getSendToken() {
    return this.acquireTokenBucket(1);
  }
  async acquireTokenBucket(amount) {
    if (!this.enabled) {
      return;
    }
    this.refillTokenBucket();
    if (amount > this.currentCapacity) {
      const delay = (amount - this.currentCapacity) / this.fillRate * 1e3;
      await new Promise((resolve2) => setTimeout(resolve2, delay));
    }
    this.currentCapacity = this.currentCapacity - amount;
  }
  refillTokenBucket() {
    const timestamp = this.getCurrentTimeInSeconds();
    if (!this.lastTimestamp) {
      this.lastTimestamp = timestamp;
      return;
    }
    const fillAmount = (timestamp - this.lastTimestamp) * this.fillRate;
    this.currentCapacity = Math.min(this.maxCapacity, this.currentCapacity + fillAmount);
    this.lastTimestamp = timestamp;
  }
  updateClientSendingRate(response) {
    let calculatedRate;
    this.updateMeasuredRate();
    if (isThrottlingError(response)) {
      const rateToUse = !this.enabled ? this.measuredTxRate : Math.min(this.measuredTxRate, this.fillRate);
      this.lastMaxRate = rateToUse;
      this.calculateTimeWindow();
      this.lastThrottleTime = this.getCurrentTimeInSeconds();
      calculatedRate = this.cubicThrottle(rateToUse);
      this.enableTokenBucket();
    } else {
      this.calculateTimeWindow();
      calculatedRate = this.cubicSuccess(this.getCurrentTimeInSeconds());
    }
    const newRate = Math.min(calculatedRate, 2 * this.measuredTxRate);
    this.updateTokenBucketRate(newRate);
  }
  calculateTimeWindow() {
    this.timeWindow = this.getPrecise(Math.pow(this.lastMaxRate * (1 - this.beta) / this.scaleConstant, 1 / 3));
  }
  cubicThrottle(rateToUse) {
    return this.getPrecise(rateToUse * this.beta);
  }
  cubicSuccess(timestamp) {
    return this.getPrecise(this.scaleConstant * Math.pow(timestamp - this.lastThrottleTime - this.timeWindow, 3) + this.lastMaxRate);
  }
  enableTokenBucket() {
    this.enabled = true;
  }
  updateTokenBucketRate(newRate) {
    this.refillTokenBucket();
    this.fillRate = Math.max(newRate, this.minFillRate);
    this.maxCapacity = Math.max(newRate, this.minCapacity);
    this.currentCapacity = Math.min(this.currentCapacity, this.maxCapacity);
  }
  updateMeasuredRate() {
    const t4 = this.getCurrentTimeInSeconds();
    const timeBucket = Math.floor(t4 * 2) / 2;
    this.requestCount++;
    if (timeBucket > this.lastTxRateBucket) {
      const currentRate = this.requestCount / (timeBucket - this.lastTxRateBucket);
      this.measuredTxRate = this.getPrecise(currentRate * this.smooth + this.measuredTxRate * (1 - this.smooth));
      this.requestCount = 0;
      this.lastTxRateBucket = timeBucket;
    }
  }
  getPrecise(num) {
    return parseFloat(num.toFixed(8));
  }
};

// node_modules/.pnpm/@smithy+util-retry@2.0.0/node_modules/@smithy/util-retry/dist-es/constants.js
var DEFAULT_RETRY_DELAY_BASE = 100;
var MAXIMUM_RETRY_DELAY = 20 * 1e3;
var THROTTLING_RETRY_DELAY_BASE = 500;
var INITIAL_RETRY_TOKENS = 500;
var RETRY_COST = 5;
var TIMEOUT_RETRY_COST = 10;
var NO_RETRY_INCREMENT = 1;
var INVOCATION_ID_HEADER = "amz-sdk-invocation-id";
var REQUEST_HEADER = "amz-sdk-request";

// node_modules/.pnpm/@smithy+util-retry@2.0.0/node_modules/@smithy/util-retry/dist-es/defaultRetryBackoffStrategy.js
var getDefaultRetryBackoffStrategy = () => {
  let delayBase = DEFAULT_RETRY_DELAY_BASE;
  const computeNextBackoffDelay = (attempts) => {
    return Math.floor(Math.min(MAXIMUM_RETRY_DELAY, Math.random() * 2 ** attempts * delayBase));
  };
  const setDelayBase = (delay) => {
    delayBase = delay;
  };
  return {
    computeNextBackoffDelay,
    setDelayBase
  };
};

// node_modules/.pnpm/@smithy+util-retry@2.0.0/node_modules/@smithy/util-retry/dist-es/defaultRetryToken.js
var createDefaultRetryToken = ({ retryDelay, retryCount, retryCost }) => {
  const getRetryCount = () => retryCount;
  const getRetryDelay = () => Math.min(MAXIMUM_RETRY_DELAY, retryDelay);
  const getRetryCost = () => retryCost;
  return {
    getRetryCount,
    getRetryDelay,
    getRetryCost
  };
};

// node_modules/.pnpm/@smithy+util-retry@2.0.0/node_modules/@smithy/util-retry/dist-es/StandardRetryStrategy.js
var StandardRetryStrategy = class {
  constructor(maxAttempts) {
    this.maxAttempts = maxAttempts;
    this.mode = RETRY_MODES.STANDARD;
    this.capacity = INITIAL_RETRY_TOKENS;
    this.retryBackoffStrategy = getDefaultRetryBackoffStrategy();
    this.maxAttemptsProvider = typeof maxAttempts === "function" ? maxAttempts : async () => maxAttempts;
  }
  async acquireInitialRetryToken(retryTokenScope) {
    return createDefaultRetryToken({
      retryDelay: DEFAULT_RETRY_DELAY_BASE,
      retryCount: 0
    });
  }
  async refreshRetryTokenForRetry(token, errorInfo) {
    const maxAttempts = await this.getMaxAttempts();
    if (this.shouldRetry(token, errorInfo, maxAttempts)) {
      const errorType = errorInfo.errorType;
      this.retryBackoffStrategy.setDelayBase(errorType === "THROTTLING" ? THROTTLING_RETRY_DELAY_BASE : DEFAULT_RETRY_DELAY_BASE);
      const delayFromErrorType = this.retryBackoffStrategy.computeNextBackoffDelay(token.getRetryCount());
      const retryDelay = errorInfo.retryAfterHint ? Math.max(errorInfo.retryAfterHint.getTime() - Date.now() || 0, delayFromErrorType) : delayFromErrorType;
      const capacityCost = this.getCapacityCost(errorType);
      this.capacity -= capacityCost;
      return createDefaultRetryToken({
        retryDelay,
        retryCount: token.getRetryCount() + 1,
        retryCost: capacityCost
      });
    }
    throw new Error("No retry token available");
  }
  recordSuccess(token) {
    var _a;
    this.capacity = Math.max(INITIAL_RETRY_TOKENS, this.capacity + ((_a = token.getRetryCost()) != null ? _a : NO_RETRY_INCREMENT));
  }
  getCapacity() {
    return this.capacity;
  }
  async getMaxAttempts() {
    try {
      return await this.maxAttemptsProvider();
    } catch (error) {
      console.warn(`Max attempts provider could not resolve. Using default of ${DEFAULT_MAX_ATTEMPTS}`);
      return DEFAULT_MAX_ATTEMPTS;
    }
  }
  shouldRetry(tokenToRenew, errorInfo, maxAttempts) {
    const attempts = tokenToRenew.getRetryCount() + 1;
    return attempts < maxAttempts && this.capacity >= this.getCapacityCost(errorInfo.errorType) && this.isRetryableError(errorInfo.errorType);
  }
  getCapacityCost(errorType) {
    return errorType === "TRANSIENT" ? TIMEOUT_RETRY_COST : RETRY_COST;
  }
  isRetryableError(errorType) {
    return errorType === "THROTTLING" || errorType === "TRANSIENT";
  }
};

// node_modules/.pnpm/@smithy+util-retry@2.0.0/node_modules/@smithy/util-retry/dist-es/AdaptiveRetryStrategy.js
var AdaptiveRetryStrategy = class {
  constructor(maxAttemptsProvider, options) {
    this.maxAttemptsProvider = maxAttemptsProvider;
    this.mode = RETRY_MODES.ADAPTIVE;
    const { rateLimiter } = options != null ? options : {};
    this.rateLimiter = rateLimiter != null ? rateLimiter : new DefaultRateLimiter();
    this.standardRetryStrategy = new StandardRetryStrategy(maxAttemptsProvider);
  }
  async acquireInitialRetryToken(retryTokenScope) {
    await this.rateLimiter.getSendToken();
    return this.standardRetryStrategy.acquireInitialRetryToken(retryTokenScope);
  }
  async refreshRetryTokenForRetry(tokenToRenew, errorInfo) {
    this.rateLimiter.updateClientSendingRate(errorInfo);
    return this.standardRetryStrategy.refreshRetryTokenForRetry(tokenToRenew, errorInfo);
  }
  recordSuccess(token) {
    this.rateLimiter.updateClientSendingRate({});
    this.standardRetryStrategy.recordSuccess(token);
  }
};

// node_modules/.pnpm/uuid@8.3.2/node_modules/uuid/dist/esm-node/rng.js
var import_crypto = __toESM(require("crypto"));
var rnds8Pool = new Uint8Array(256);
var poolPtr = rnds8Pool.length;
function rng() {
  if (poolPtr > rnds8Pool.length - 16) {
    import_crypto.default.randomFillSync(rnds8Pool);
    poolPtr = 0;
  }
  return rnds8Pool.slice(poolPtr, poolPtr += 16);
}

// node_modules/.pnpm/uuid@8.3.2/node_modules/uuid/dist/esm-node/regex.js
var regex_default = /^(?:[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}|00000000-0000-0000-0000-000000000000)$/i;

// node_modules/.pnpm/uuid@8.3.2/node_modules/uuid/dist/esm-node/validate.js
function validate2(uuid) {
  return typeof uuid === "string" && regex_default.test(uuid);
}
var validate_default = validate2;

// node_modules/.pnpm/uuid@8.3.2/node_modules/uuid/dist/esm-node/stringify.js
var byteToHex = [];
for (let i5 = 0; i5 < 256; ++i5) {
  byteToHex.push((i5 + 256).toString(16).substr(1));
}
function stringify(arr, offset = 0) {
  const uuid = (byteToHex[arr[offset + 0]] + byteToHex[arr[offset + 1]] + byteToHex[arr[offset + 2]] + byteToHex[arr[offset + 3]] + "-" + byteToHex[arr[offset + 4]] + byteToHex[arr[offset + 5]] + "-" + byteToHex[arr[offset + 6]] + byteToHex[arr[offset + 7]] + "-" + byteToHex[arr[offset + 8]] + byteToHex[arr[offset + 9]] + "-" + byteToHex[arr[offset + 10]] + byteToHex[arr[offset + 11]] + byteToHex[arr[offset + 12]] + byteToHex[arr[offset + 13]] + byteToHex[arr[offset + 14]] + byteToHex[arr[offset + 15]]).toLowerCase();
  if (!validate_default(uuid)) {
    throw TypeError("Stringified UUID is invalid");
  }
  return uuid;
}
var stringify_default = stringify;

// node_modules/.pnpm/uuid@8.3.2/node_modules/uuid/dist/esm-node/v4.js
function v4(options, buf, offset) {
  options = options || {};
  const rnds = options.random || (options.rng || rng)();
  rnds[6] = rnds[6] & 15 | 64;
  rnds[8] = rnds[8] & 63 | 128;
  if (buf) {
    offset = offset || 0;
    for (let i5 = 0; i5 < 16; ++i5) {
      buf[offset + i5] = rnds[i5];
    }
    return buf;
  }
  return stringify_default(rnds);
}
var v4_default = v4;

// node_modules/.pnpm/@smithy+middleware-retry@2.0.9/node_modules/@smithy/middleware-retry/dist-es/util.js
var asSdkError = (error) => {
  if (error instanceof Error)
    return error;
  if (error instanceof Object)
    return Object.assign(new Error(), error);
  if (typeof error === "string")
    return new Error(error);
  return new Error(`AWS SDK error wrapper for ${error}`);
};

// node_modules/.pnpm/@smithy+middleware-retry@2.0.9/node_modules/@smithy/middleware-retry/dist-es/configurations.js
var ENV_MAX_ATTEMPTS = "AWS_MAX_ATTEMPTS";
var CONFIG_MAX_ATTEMPTS = "max_attempts";
var NODE_MAX_ATTEMPT_CONFIG_OPTIONS = {
  environmentVariableSelector: (env2) => {
    const value = env2[ENV_MAX_ATTEMPTS];
    if (!value)
      return void 0;
    const maxAttempt = parseInt(value);
    if (Number.isNaN(maxAttempt)) {
      throw new Error(`Environment variable ${ENV_MAX_ATTEMPTS} mast be a number, got "${value}"`);
    }
    return maxAttempt;
  },
  configFileSelector: (profile) => {
    const value = profile[CONFIG_MAX_ATTEMPTS];
    if (!value)
      return void 0;
    const maxAttempt = parseInt(value);
    if (Number.isNaN(maxAttempt)) {
      throw new Error(`Shared config file entry ${CONFIG_MAX_ATTEMPTS} mast be a number, got "${value}"`);
    }
    return maxAttempt;
  },
  default: DEFAULT_MAX_ATTEMPTS
};
var resolveRetryConfig = (input) => {
  var _a;
  const { retryStrategy } = input;
  const maxAttempts = normalizeProvider((_a = input.maxAttempts) != null ? _a : DEFAULT_MAX_ATTEMPTS);
  return {
    ...input,
    maxAttempts,
    retryStrategy: async () => {
      if (retryStrategy) {
        return retryStrategy;
      }
      const retryMode = await normalizeProvider(input.retryMode)();
      if (retryMode === RETRY_MODES.ADAPTIVE) {
        return new AdaptiveRetryStrategy(maxAttempts);
      }
      return new StandardRetryStrategy(maxAttempts);
    }
  };
};
var ENV_RETRY_MODE = "AWS_RETRY_MODE";
var CONFIG_RETRY_MODE = "retry_mode";
var NODE_RETRY_MODE_CONFIG_OPTIONS = {
  environmentVariableSelector: (env2) => env2[ENV_RETRY_MODE],
  configFileSelector: (profile) => profile[CONFIG_RETRY_MODE],
  default: DEFAULT_RETRY_MODE
};

// node_modules/.pnpm/@smithy+middleware-retry@2.0.9/node_modules/@smithy/middleware-retry/dist-es/retryMiddleware.js
var retryMiddleware = (options) => (next, context) => async (args) => {
  let retryStrategy = await options.retryStrategy();
  const maxAttempts = await options.maxAttempts();
  if (isRetryStrategyV2(retryStrategy)) {
    retryStrategy = retryStrategy;
    let retryToken = await retryStrategy.acquireInitialRetryToken(context["partition_id"]);
    let lastError = new Error();
    let attempts = 0;
    let totalRetryDelay = 0;
    const { request: request2 } = args;
    if (HttpRequest2.isInstance(request2)) {
      request2.headers[INVOCATION_ID_HEADER] = v4_default();
    }
    while (true) {
      try {
        if (HttpRequest2.isInstance(request2)) {
          request2.headers[REQUEST_HEADER] = `attempt=${attempts + 1}; max=${maxAttempts}`;
        }
        const { response, output } = await next(args);
        retryStrategy.recordSuccess(retryToken);
        output.$metadata.attempts = attempts + 1;
        output.$metadata.totalRetryDelay = totalRetryDelay;
        return { response, output };
      } catch (e5) {
        const retryErrorInfo = getRetryErrorInfo(e5);
        lastError = asSdkError(e5);
        try {
          retryToken = await retryStrategy.refreshRetryTokenForRetry(retryToken, retryErrorInfo);
        } catch (refreshError) {
          if (!lastError.$metadata) {
            lastError.$metadata = {};
          }
          lastError.$metadata.attempts = attempts + 1;
          lastError.$metadata.totalRetryDelay = totalRetryDelay;
          throw lastError;
        }
        attempts = retryToken.getRetryCount();
        const delay = retryToken.getRetryDelay();
        totalRetryDelay += delay;
        await new Promise((resolve2) => setTimeout(resolve2, delay));
      }
    }
  } else {
    retryStrategy = retryStrategy;
    if (retryStrategy == null ? void 0 : retryStrategy.mode)
      context.userAgent = [...context.userAgent || [], ["cfg/retry-mode", retryStrategy.mode]];
    return retryStrategy.retry(next, args);
  }
};
var isRetryStrategyV2 = (retryStrategy) => typeof retryStrategy.acquireInitialRetryToken !== "undefined" && typeof retryStrategy.refreshRetryTokenForRetry !== "undefined" && typeof retryStrategy.recordSuccess !== "undefined";
var getRetryErrorInfo = (error) => {
  const errorInfo = {
    errorType: getRetryErrorType(error)
  };
  const retryAfterHint = getRetryAfterHint(error.$response);
  if (retryAfterHint) {
    errorInfo.retryAfterHint = retryAfterHint;
  }
  return errorInfo;
};
var getRetryErrorType = (error) => {
  if (isThrottlingError(error))
    return "THROTTLING";
  if (isTransientError(error))
    return "TRANSIENT";
  if (isServerError(error))
    return "SERVER_ERROR";
  return "CLIENT_ERROR";
};
var retryMiddlewareOptions = {
  name: "retryMiddleware",
  tags: ["RETRY"],
  step: "finalizeRequest",
  priority: "high",
  override: true
};
var getRetryPlugin = (options) => ({
  applyToStack: (clientStack) => {
    clientStack.add(retryMiddleware(options), retryMiddlewareOptions);
  }
});
var getRetryAfterHint = (response) => {
  if (!HttpResponse2.isInstance(response))
    return;
  const retryAfterHeaderName = Object.keys(response.headers).find((key) => key.toLowerCase() === "retry-after");
  if (!retryAfterHeaderName)
    return;
  const retryAfter = response.headers[retryAfterHeaderName];
  const retryAfterSeconds = Number(retryAfter);
  if (!Number.isNaN(retryAfterSeconds))
    return new Date(retryAfterSeconds * 1e3);
  const retryAfterDate = new Date(retryAfter);
  return retryAfterDate;
};

// node_modules/.pnpm/@smithy+smithy-client@2.1.3/node_modules/@smithy/smithy-client/dist-es/NoOpLogger.js
var NoOpLogger = class {
  trace() {
  }
  debug() {
  }
  info() {
  }
  warn() {
  }
  error() {
  }
};

// node_modules/.pnpm/@smithy+middleware-stack@2.0.0/node_modules/@smithy/middleware-stack/dist-es/MiddlewareStack.js
var constructStack = () => {
  let absoluteEntries = [];
  let relativeEntries = [];
  const entriesNameSet = /* @__PURE__ */ new Set();
  const sort = (entries) => entries.sort((a5, b5) => stepWeights[b5.step] - stepWeights[a5.step] || priorityWeights[b5.priority || "normal"] - priorityWeights[a5.priority || "normal"]);
  const removeByName = (toRemove) => {
    let isRemoved = false;
    const filterCb = (entry) => {
      if (entry.name && entry.name === toRemove) {
        isRemoved = true;
        entriesNameSet.delete(toRemove);
        return false;
      }
      return true;
    };
    absoluteEntries = absoluteEntries.filter(filterCb);
    relativeEntries = relativeEntries.filter(filterCb);
    return isRemoved;
  };
  const removeByReference = (toRemove) => {
    let isRemoved = false;
    const filterCb = (entry) => {
      if (entry.middleware === toRemove) {
        isRemoved = true;
        if (entry.name)
          entriesNameSet.delete(entry.name);
        return false;
      }
      return true;
    };
    absoluteEntries = absoluteEntries.filter(filterCb);
    relativeEntries = relativeEntries.filter(filterCb);
    return isRemoved;
  };
  const cloneTo = (toStack) => {
    absoluteEntries.forEach((entry) => {
      toStack.add(entry.middleware, { ...entry });
    });
    relativeEntries.forEach((entry) => {
      toStack.addRelativeTo(entry.middleware, { ...entry });
    });
    return toStack;
  };
  const expandRelativeMiddlewareList = (from) => {
    const expandedMiddlewareList = [];
    from.before.forEach((entry) => {
      if (entry.before.length === 0 && entry.after.length === 0) {
        expandedMiddlewareList.push(entry);
      } else {
        expandedMiddlewareList.push(...expandRelativeMiddlewareList(entry));
      }
    });
    expandedMiddlewareList.push(from);
    from.after.reverse().forEach((entry) => {
      if (entry.before.length === 0 && entry.after.length === 0) {
        expandedMiddlewareList.push(entry);
      } else {
        expandedMiddlewareList.push(...expandRelativeMiddlewareList(entry));
      }
    });
    return expandedMiddlewareList;
  };
  const getMiddlewareList = (debug = false) => {
    const normalizedAbsoluteEntries = [];
    const normalizedRelativeEntries = [];
    const normalizedEntriesNameMap = {};
    absoluteEntries.forEach((entry) => {
      const normalizedEntry = {
        ...entry,
        before: [],
        after: []
      };
      if (normalizedEntry.name)
        normalizedEntriesNameMap[normalizedEntry.name] = normalizedEntry;
      normalizedAbsoluteEntries.push(normalizedEntry);
    });
    relativeEntries.forEach((entry) => {
      const normalizedEntry = {
        ...entry,
        before: [],
        after: []
      };
      if (normalizedEntry.name)
        normalizedEntriesNameMap[normalizedEntry.name] = normalizedEntry;
      normalizedRelativeEntries.push(normalizedEntry);
    });
    normalizedRelativeEntries.forEach((entry) => {
      if (entry.toMiddleware) {
        const toMiddleware = normalizedEntriesNameMap[entry.toMiddleware];
        if (toMiddleware === void 0) {
          if (debug) {
            return;
          }
          throw new Error(`${entry.toMiddleware} is not found when adding ${entry.name || "anonymous"} middleware ${entry.relation} ${entry.toMiddleware}`);
        }
        if (entry.relation === "after") {
          toMiddleware.after.push(entry);
        }
        if (entry.relation === "before") {
          toMiddleware.before.push(entry);
        }
      }
    });
    const mainChain = sort(normalizedAbsoluteEntries).map(expandRelativeMiddlewareList).reduce((wholeList, expandedMiddlewareList) => {
      wholeList.push(...expandedMiddlewareList);
      return wholeList;
    }, []);
    return mainChain;
  };
  const stack = {
    add: (middleware, options = {}) => {
      const { name, override } = options;
      const entry = {
        step: "initialize",
        priority: "normal",
        middleware,
        ...options
      };
      if (name) {
        if (entriesNameSet.has(name)) {
          if (!override)
            throw new Error(`Duplicate middleware name '${name}'`);
          const toOverrideIndex = absoluteEntries.findIndex((entry2) => entry2.name === name);
          const toOverride = absoluteEntries[toOverrideIndex];
          if (toOverride.step !== entry.step || toOverride.priority !== entry.priority) {
            throw new Error(`"${name}" middleware with ${toOverride.priority} priority in ${toOverride.step} step cannot be overridden by same-name middleware with ${entry.priority} priority in ${entry.step} step.`);
          }
          absoluteEntries.splice(toOverrideIndex, 1);
        }
        entriesNameSet.add(name);
      }
      absoluteEntries.push(entry);
    },
    addRelativeTo: (middleware, options) => {
      const { name, override } = options;
      const entry = {
        middleware,
        ...options
      };
      if (name) {
        if (entriesNameSet.has(name)) {
          if (!override)
            throw new Error(`Duplicate middleware name '${name}'`);
          const toOverrideIndex = relativeEntries.findIndex((entry2) => entry2.name === name);
          const toOverride = relativeEntries[toOverrideIndex];
          if (toOverride.toMiddleware !== entry.toMiddleware || toOverride.relation !== entry.relation) {
            throw new Error(`"${name}" middleware ${toOverride.relation} "${toOverride.toMiddleware}" middleware cannot be overridden by same-name middleware ${entry.relation} "${entry.toMiddleware}" middleware.`);
          }
          relativeEntries.splice(toOverrideIndex, 1);
        }
        entriesNameSet.add(name);
      }
      relativeEntries.push(entry);
    },
    clone: () => cloneTo(constructStack()),
    use: (plugin) => {
      plugin.applyToStack(stack);
    },
    remove: (toRemove) => {
      if (typeof toRemove === "string")
        return removeByName(toRemove);
      else
        return removeByReference(toRemove);
    },
    removeByTag: (toRemove) => {
      let isRemoved = false;
      const filterCb = (entry) => {
        const { tags, name } = entry;
        if (tags && tags.includes(toRemove)) {
          if (name)
            entriesNameSet.delete(name);
          isRemoved = true;
          return false;
        }
        return true;
      };
      absoluteEntries = absoluteEntries.filter(filterCb);
      relativeEntries = relativeEntries.filter(filterCb);
      return isRemoved;
    },
    concat: (from) => {
      const cloned = cloneTo(constructStack());
      cloned.use(from);
      return cloned;
    },
    applyToStack: cloneTo,
    identify: () => {
      return getMiddlewareList(true).map((mw) => {
        return mw.name + ": " + (mw.tags || []).join(",");
      });
    },
    resolve: (handler, context) => {
      for (const middleware of getMiddlewareList().map((entry) => entry.middleware).reverse()) {
        handler = middleware(handler, context);
      }
      return handler;
    }
  };
  return stack;
};
var stepWeights = {
  initialize: 5,
  serialize: 4,
  build: 3,
  finalizeRequest: 2,
  deserialize: 1
};
var priorityWeights = {
  high: 3,
  normal: 2,
  low: 1
};

// node_modules/.pnpm/@smithy+smithy-client@2.1.3/node_modules/@smithy/smithy-client/dist-es/client.js
var Client = class {
  constructor(config) {
    this.middlewareStack = constructStack();
    this.config = config;
  }
  send(command, optionsOrCb, cb) {
    const options = typeof optionsOrCb !== "function" ? optionsOrCb : void 0;
    const callback = typeof optionsOrCb === "function" ? optionsOrCb : cb;
    const handler = command.resolveMiddleware(this.middlewareStack, this.config, options);
    if (callback) {
      handler(command).then((result) => callback(null, result.output), (err) => callback(err)).catch(() => {
      });
    } else {
      return handler(command).then((result) => result.output);
    }
  }
  destroy() {
    if (this.config.requestHandler.destroy)
      this.config.requestHandler.destroy();
  }
};

// node_modules/.pnpm/@smithy+util-base64@2.0.0/node_modules/@smithy/util-base64/dist-es/fromBase64.js
var BASE64_REGEX = /^[A-Za-z0-9+/]*={0,2}$/;
var fromBase64 = (input) => {
  if (input.length * 3 % 4 !== 0) {
    throw new TypeError(`Incorrect padding on base64 string.`);
  }
  if (!BASE64_REGEX.exec(input)) {
    throw new TypeError(`Invalid base64 string.`);
  }
  const buffer = fromString(input, "base64");
  return new Uint8Array(buffer.buffer, buffer.byteOffset, buffer.byteLength);
};

// node_modules/.pnpm/@smithy+util-base64@2.0.0/node_modules/@smithy/util-base64/dist-es/toBase64.js
var toBase64 = (input) => fromArrayBuffer(input.buffer, input.byteOffset, input.byteLength).toString("base64");

// node_modules/.pnpm/@smithy+util-stream@2.0.9/node_modules/@smithy/util-stream/dist-es/blob/transforms.js
function transformToString(payload, encoding = "utf-8") {
  if (encoding === "base64") {
    return toBase64(payload);
  }
  return toUtf84(payload);
}
function transformFromString(str, encoding) {
  if (encoding === "base64") {
    return Uint8ArrayBlobAdapter.mutate(fromBase64(str));
  }
  return Uint8ArrayBlobAdapter.mutate(fromUtf84(str));
}

// node_modules/.pnpm/@smithy+util-stream@2.0.9/node_modules/@smithy/util-stream/dist-es/blob/Uint8ArrayBlobAdapter.js
var Uint8ArrayBlobAdapter = class _Uint8ArrayBlobAdapter extends Uint8Array {
  static fromString(source, encoding = "utf-8") {
    switch (typeof source) {
      case "string":
        return transformFromString(source, encoding);
      default:
        throw new Error(`Unsupported conversion from ${typeof source} to Uint8ArrayBlobAdapter.`);
    }
  }
  static mutate(source) {
    Object.setPrototypeOf(source, _Uint8ArrayBlobAdapter.prototype);
    return source;
  }
  transformToString(encoding = "utf-8") {
    return transformToString(this, encoding);
  }
};

// node_modules/.pnpm/@smithy+util-stream@2.0.9/node_modules/@smithy/util-stream/dist-es/getAwsChunkedEncodingStream.js
var import_stream = require("stream");
var getAwsChunkedEncodingStream = (readableStream, options) => {
  const { base64Encoder, bodyLengthChecker, checksumAlgorithmFn, checksumLocationName, streamHasher } = options;
  const checksumRequired = base64Encoder !== void 0 && checksumAlgorithmFn !== void 0 && checksumLocationName !== void 0 && streamHasher !== void 0;
  const digest = checksumRequired ? streamHasher(checksumAlgorithmFn, readableStream) : void 0;
  const awsChunkedEncodingStream = new import_stream.Readable({ read: () => {
  } });
  readableStream.on("data", (data) => {
    const length = bodyLengthChecker(data) || 0;
    awsChunkedEncodingStream.push(`${length.toString(16)}\r
`);
    awsChunkedEncodingStream.push(data);
    awsChunkedEncodingStream.push("\r\n");
  });
  readableStream.on("end", async () => {
    awsChunkedEncodingStream.push(`0\r
`);
    if (checksumRequired) {
      const checksum = base64Encoder(await digest);
      awsChunkedEncodingStream.push(`${checksumLocationName}:${checksum}\r
`);
      awsChunkedEncodingStream.push(`\r
`);
    }
    awsChunkedEncodingStream.push(null);
  });
  return awsChunkedEncodingStream;
};

// node_modules/.pnpm/@smithy+querystring-builder@2.0.6/node_modules/@smithy/querystring-builder/dist-es/index.js
function buildQueryString(query) {
  const parts = [];
  for (let key of Object.keys(query).sort()) {
    const value = query[key];
    key = escapeUri(key);
    if (Array.isArray(value)) {
      for (let i5 = 0, iLen = value.length; i5 < iLen; i5++) {
        parts.push(`${key}=${escapeUri(value[i5])}`);
      }
    } else {
      let qsEntry = key;
      if (value || typeof value === "string") {
        qsEntry += `=${escapeUri(value)}`;
      }
      parts.push(qsEntry);
    }
  }
  return parts.join("&");
}

// node_modules/.pnpm/@smithy+node-http-handler@2.1.2/node_modules/@smithy/node-http-handler/dist-es/node-http-handler.js
var import_http = require("http");
var import_https = require("https");

// node_modules/.pnpm/@smithy+node-http-handler@2.1.2/node_modules/@smithy/node-http-handler/dist-es/constants.js
var NODEJS_TIMEOUT_ERROR_CODES2 = ["ECONNRESET", "EPIPE", "ETIMEDOUT"];

// node_modules/.pnpm/@smithy+node-http-handler@2.1.2/node_modules/@smithy/node-http-handler/dist-es/get-transformed-headers.js
var getTransformedHeaders = (headers) => {
  const transformedHeaders = {};
  for (const name of Object.keys(headers)) {
    const headerValues = headers[name];
    transformedHeaders[name] = Array.isArray(headerValues) ? headerValues.join(",") : headerValues;
  }
  return transformedHeaders;
};

// node_modules/.pnpm/@smithy+node-http-handler@2.1.2/node_modules/@smithy/node-http-handler/dist-es/set-connection-timeout.js
var setConnectionTimeout = (request2, reject, timeoutInMs = 0) => {
  if (!timeoutInMs) {
    return;
  }
  const timeoutId = setTimeout(() => {
    request2.destroy();
    reject(Object.assign(new Error(`Socket timed out without establishing a connection within ${timeoutInMs} ms`), {
      name: "TimeoutError"
    }));
  }, timeoutInMs);
  request2.on("socket", (socket) => {
    if (socket.connecting) {
      socket.on("connect", () => {
        clearTimeout(timeoutId);
      });
    } else {
      clearTimeout(timeoutId);
    }
  });
};

// node_modules/.pnpm/@smithy+node-http-handler@2.1.2/node_modules/@smithy/node-http-handler/dist-es/set-socket-keep-alive.js
var setSocketKeepAlive = (request2, { keepAlive, keepAliveMsecs }) => {
  if (keepAlive !== true) {
    return;
  }
  request2.on("socket", (socket) => {
    socket.setKeepAlive(keepAlive, keepAliveMsecs || 0);
  });
};

// node_modules/.pnpm/@smithy+node-http-handler@2.1.2/node_modules/@smithy/node-http-handler/dist-es/set-socket-timeout.js
var setSocketTimeout = (request2, reject, timeoutInMs = 0) => {
  request2.setTimeout(timeoutInMs, () => {
    request2.destroy();
    reject(Object.assign(new Error(`Connection timed out after ${timeoutInMs} ms`), { name: "TimeoutError" }));
  });
};

// node_modules/.pnpm/@smithy+node-http-handler@2.1.2/node_modules/@smithy/node-http-handler/dist-es/write-request-body.js
var import_stream2 = require("stream");
var MIN_WAIT_TIME = 1e3;
async function writeRequestBody(httpRequest2, request2, maxContinueTimeoutMs = MIN_WAIT_TIME) {
  var _a;
  const headers = (_a = request2.headers) != null ? _a : {};
  const expect = headers["Expect"] || headers["expect"];
  let timeoutId = -1;
  let hasError = false;
  if (expect === "100-continue") {
    await Promise.race([
      new Promise((resolve2) => {
        timeoutId = Number(setTimeout(resolve2, Math.max(MIN_WAIT_TIME, maxContinueTimeoutMs)));
      }),
      new Promise((resolve2) => {
        httpRequest2.on("continue", () => {
          clearTimeout(timeoutId);
          resolve2();
        });
        httpRequest2.on("error", () => {
          hasError = true;
          clearTimeout(timeoutId);
          resolve2();
        });
      })
    ]);
  }
  if (!hasError) {
    writeBody(httpRequest2, request2.body);
  }
}
function writeBody(httpRequest2, body) {
  if (body instanceof import_stream2.Readable) {
    body.pipe(httpRequest2);
  } else if (body) {
    httpRequest2.end(Buffer.from(body));
  } else {
    httpRequest2.end();
  }
}

// node_modules/.pnpm/@smithy+node-http-handler@2.1.2/node_modules/@smithy/node-http-handler/dist-es/node-http-handler.js
var NodeHttpHandler = class {
  constructor(options) {
    this.metadata = { handlerProtocol: "http/1.1" };
    this.configProvider = new Promise((resolve2, reject) => {
      if (typeof options === "function") {
        options().then((_options) => {
          resolve2(this.resolveDefaultConfig(_options));
        }).catch(reject);
      } else {
        resolve2(this.resolveDefaultConfig(options));
      }
    });
  }
  resolveDefaultConfig(options) {
    const { requestTimeout, connectionTimeout, socketTimeout, httpAgent, httpsAgent } = options || {};
    const keepAlive = true;
    const maxSockets = 50;
    return {
      connectionTimeout,
      requestTimeout: requestTimeout != null ? requestTimeout : socketTimeout,
      httpAgent: httpAgent || new import_http.Agent({ keepAlive, maxSockets }),
      httpsAgent: httpsAgent || new import_https.Agent({ keepAlive, maxSockets })
    };
  }
  destroy() {
    var _a, _b, _c, _d;
    (_b = (_a = this.config) == null ? void 0 : _a.httpAgent) == null ? void 0 : _b.destroy();
    (_d = (_c = this.config) == null ? void 0 : _c.httpsAgent) == null ? void 0 : _d.destroy();
  }
  async handle(request2, { abortSignal } = {}) {
    if (!this.config) {
      this.config = await this.configProvider;
    }
    return new Promise((_resolve, _reject) => {
      var _a, _b;
      let writeRequestBodyPromise = void 0;
      const resolve2 = async (arg) => {
        await writeRequestBodyPromise;
        _resolve(arg);
      };
      const reject = async (arg) => {
        await writeRequestBodyPromise;
        _reject(arg);
      };
      if (!this.config) {
        throw new Error("Node HTTP request handler config is not resolved");
      }
      if (abortSignal == null ? void 0 : abortSignal.aborted) {
        const abortError = new Error("Request aborted");
        abortError.name = "AbortError";
        reject(abortError);
        return;
      }
      const isSSL = request2.protocol === "https:";
      const queryString = buildQueryString(request2.query || {});
      let auth = void 0;
      if (request2.username != null || request2.password != null) {
        const username = (_a = request2.username) != null ? _a : "";
        const password = (_b = request2.password) != null ? _b : "";
        auth = `${username}:${password}`;
      }
      let path = request2.path;
      if (queryString) {
        path += `?${queryString}`;
      }
      if (request2.fragment) {
        path += `#${request2.fragment}`;
      }
      const nodeHttpsOptions = {
        headers: request2.headers,
        host: request2.hostname,
        method: request2.method,
        path,
        port: request2.port,
        agent: isSSL ? this.config.httpsAgent : this.config.httpAgent,
        auth
      };
      const requestFunc = isSSL ? import_https.request : import_http.request;
      const req = requestFunc(nodeHttpsOptions, (res) => {
        const httpResponse = new HttpResponse2({
          statusCode: res.statusCode || -1,
          reason: res.statusMessage,
          headers: getTransformedHeaders(res.headers),
          body: res
        });
        resolve2({ response: httpResponse });
      });
      req.on("error", (err) => {
        if (NODEJS_TIMEOUT_ERROR_CODES2.includes(err.code)) {
          reject(Object.assign(err, { name: "TimeoutError" }));
        } else {
          reject(err);
        }
      });
      setConnectionTimeout(req, reject, this.config.connectionTimeout);
      setSocketTimeout(req, reject, this.config.requestTimeout);
      if (abortSignal) {
        abortSignal.onabort = () => {
          req.abort();
          const abortError = new Error("Request aborted");
          abortError.name = "AbortError";
          reject(abortError);
        };
      }
      const httpAgent = nodeHttpsOptions.agent;
      if (typeof httpAgent === "object" && "keepAlive" in httpAgent) {
        setSocketKeepAlive(req, {
          keepAlive: httpAgent.keepAlive,
          keepAliveMsecs: httpAgent.keepAliveMsecs
        });
      }
      writeRequestBodyPromise = writeRequestBody(req, request2, this.config.requestTimeout).catch(_reject);
    });
  }
  updateHttpClientConfig(key, value) {
    this.config = void 0;
    this.configProvider = this.configProvider.then((config) => {
      return {
        ...config,
        [key]: value
      };
    });
  }
  httpHandlerConfigs() {
    var _a;
    return (_a = this.config) != null ? _a : {};
  }
};

// node_modules/.pnpm/@smithy+node-http-handler@2.1.2/node_modules/@smithy/node-http-handler/dist-es/node-http2-connection-pool.js
var NodeHttp2ConnectionPool = class {
  constructor(sessions) {
    this.sessions = [];
    this.sessions = sessions != null ? sessions : [];
  }
  poll() {
    if (this.sessions.length > 0) {
      return this.sessions.shift();
    }
  }
  offerLast(session) {
    this.sessions.push(session);
  }
  contains(session) {
    return this.sessions.includes(session);
  }
  remove(session) {
    this.sessions = this.sessions.filter((s5) => s5 !== session);
  }
  [Symbol.iterator]() {
    return this.sessions[Symbol.iterator]();
  }
  destroy(connection) {
    for (const session of this.sessions) {
      if (session === connection) {
        if (!session.destroyed) {
          session.destroy();
        }
      }
    }
  }
};

// node_modules/.pnpm/@smithy+node-http-handler@2.1.2/node_modules/@smithy/node-http-handler/dist-es/stream-collector/collector.js
var import_stream3 = require("stream");
var Collector = class extends import_stream3.Writable {
  constructor() {
    super(...arguments);
    this.bufferedBytes = [];
  }
  _write(chunk, encoding, callback) {
    this.bufferedBytes.push(chunk);
    callback();
  }
};

// node_modules/.pnpm/@smithy+node-http-handler@2.1.2/node_modules/@smithy/node-http-handler/dist-es/stream-collector/index.js
var streamCollector = (stream) => new Promise((resolve2, reject) => {
  const collector = new Collector();
  stream.pipe(collector);
  stream.on("error", (err) => {
    collector.end();
    reject(err);
  });
  collector.on("error", reject);
  collector.on("finish", function() {
    const bytes = new Uint8Array(Buffer.concat(this.bufferedBytes));
    resolve2(bytes);
  });
});

// node_modules/.pnpm/@smithy+util-stream@2.0.9/node_modules/@smithy/util-stream/dist-es/sdk-stream-mixin.js
var import_stream4 = require("stream");
var import_util3 = require("util");
var ERR_MSG_STREAM_HAS_BEEN_TRANSFORMED = "The stream has already been transformed.";
var sdkStreamMixin = (stream) => {
  var _a, _b;
  if (!(stream instanceof import_stream4.Readable)) {
    const name = ((_b = (_a = stream == null ? void 0 : stream.__proto__) == null ? void 0 : _a.constructor) == null ? void 0 : _b.name) || stream;
    throw new Error(`Unexpected stream implementation, expect Stream.Readable instance, got ${name}`);
  }
  let transformed = false;
  const transformToByteArray = async () => {
    if (transformed) {
      throw new Error(ERR_MSG_STREAM_HAS_BEEN_TRANSFORMED);
    }
    transformed = true;
    return await streamCollector(stream);
  };
  return Object.assign(stream, {
    transformToByteArray,
    transformToString: async (encoding) => {
      const buf = await transformToByteArray();
      if (encoding === void 0 || Buffer.isEncoding(encoding)) {
        return fromArrayBuffer(buf.buffer, buf.byteOffset, buf.byteLength).toString(encoding);
      } else {
        const decoder = new import_util3.TextDecoder(encoding);
        return decoder.decode(buf);
      }
    },
    transformToWebStream: () => {
      if (transformed) {
        throw new Error(ERR_MSG_STREAM_HAS_BEEN_TRANSFORMED);
      }
      if (stream.readableFlowing !== null) {
        throw new Error("The stream has been consumed by other callbacks.");
      }
      if (typeof import_stream4.Readable.toWeb !== "function") {
        throw new Error("Readable.toWeb() is not supported. Please make sure you are using Node.js >= 17.0.0, or polyfill is available.");
      }
      transformed = true;
      return import_stream4.Readable.toWeb(stream);
    }
  });
};

// node_modules/.pnpm/@smithy+smithy-client@2.1.3/node_modules/@smithy/smithy-client/dist-es/collect-stream-body.js
var collectBody = async (streamBody = new Uint8Array(), context) => {
  if (streamBody instanceof Uint8Array) {
    return Uint8ArrayBlobAdapter.mutate(streamBody);
  }
  if (!streamBody) {
    return Uint8ArrayBlobAdapter.mutate(new Uint8Array());
  }
  const fromContext = context.streamCollector(streamBody);
  return Uint8ArrayBlobAdapter.mutate(await fromContext);
};

// node_modules/.pnpm/@smithy+smithy-client@2.1.3/node_modules/@smithy/smithy-client/dist-es/command.js
var Command = class {
  constructor() {
    this.middlewareStack = constructStack();
  }
};

// node_modules/.pnpm/@smithy+smithy-client@2.1.3/node_modules/@smithy/smithy-client/dist-es/constants.js
var SENSITIVE_STRING = "***SensitiveInformation***";

// node_modules/.pnpm/@smithy+smithy-client@2.1.3/node_modules/@smithy/smithy-client/dist-es/create-aggregated-client.js
var createAggregatedClient = (commands2, Client2) => {
  for (const command of Object.keys(commands2)) {
    const CommandCtor = commands2[command];
    const methodImpl = async function(args, optionsOrCb, cb) {
      const command2 = new CommandCtor(args);
      if (typeof optionsOrCb === "function") {
        this.send(command2, optionsOrCb);
      } else if (typeof cb === "function") {
        if (typeof optionsOrCb !== "object")
          throw new Error(`Expected http options but got ${typeof optionsOrCb}`);
        this.send(command2, optionsOrCb || {}, cb);
      } else {
        return this.send(command2, optionsOrCb);
      }
    };
    const methodName = (command[0].toLowerCase() + command.slice(1)).replace(/Command$/, "");
    Client2.prototype[methodName] = methodImpl;
  }
};

// node_modules/.pnpm/@smithy+smithy-client@2.1.3/node_modules/@smithy/smithy-client/dist-es/parse-utils.js
var parseBoolean = (value) => {
  switch (value) {
    case "true":
      return true;
    case "false":
      return false;
    default:
      throw new Error(`Unable to parse boolean value "${value}"`);
  }
};
var expectNumber = (value) => {
  if (value === null || value === void 0) {
    return void 0;
  }
  if (typeof value === "string") {
    const parsed = parseFloat(value);
    if (!Number.isNaN(parsed)) {
      if (String(parsed) !== String(value)) {
        logger.warn(stackTraceWarning(`Expected number but observed string: ${value}`));
      }
      return parsed;
    }
  }
  if (typeof value === "number") {
    return value;
  }
  throw new TypeError(`Expected number, got ${typeof value}: ${value}`);
};
var MAX_FLOAT = Math.ceil(2 ** 127 * (2 - 2 ** -23));
var expectFloat32 = (value) => {
  const expected = expectNumber(value);
  if (expected !== void 0 && !Number.isNaN(expected) && expected !== Infinity && expected !== -Infinity) {
    if (Math.abs(expected) > MAX_FLOAT) {
      throw new TypeError(`Expected 32-bit float, got ${value}`);
    }
  }
  return expected;
};
var expectLong = (value) => {
  if (value === null || value === void 0) {
    return void 0;
  }
  if (Number.isInteger(value) && !Number.isNaN(value)) {
    return value;
  }
  throw new TypeError(`Expected integer, got ${typeof value}: ${value}`);
};
var expectInt32 = (value) => expectSizedInt(value, 32);
var expectShort = (value) => expectSizedInt(value, 16);
var expectByte = (value) => expectSizedInt(value, 8);
var expectSizedInt = (value, size) => {
  const expected = expectLong(value);
  if (expected !== void 0 && castInt(expected, size) !== expected) {
    throw new TypeError(`Expected ${size}-bit integer, got ${value}`);
  }
  return expected;
};
var castInt = (value, size) => {
  switch (size) {
    case 32:
      return Int32Array.of(value)[0];
    case 16:
      return Int16Array.of(value)[0];
    case 8:
      return Int8Array.of(value)[0];
  }
};
var expectNonNull = (value, location) => {
  if (value === null || value === void 0) {
    if (location) {
      throw new TypeError(`Expected a non-null value for ${location}`);
    }
    throw new TypeError("Expected a non-null value");
  }
  return value;
};
var expectObject = (value) => {
  if (value === null || value === void 0) {
    return void 0;
  }
  if (typeof value === "object" && !Array.isArray(value)) {
    return value;
  }
  const receivedType = Array.isArray(value) ? "array" : typeof value;
  throw new TypeError(`Expected object, got ${receivedType}: ${value}`);
};
var expectString = (value) => {
  if (value === null || value === void 0) {
    return void 0;
  }
  if (typeof value === "string") {
    return value;
  }
  if (["boolean", "number", "bigint"].includes(typeof value)) {
    logger.warn(stackTraceWarning(`Expected string, got ${typeof value}: ${value}`));
    return String(value);
  }
  throw new TypeError(`Expected string, got ${typeof value}: ${value}`);
};
var strictParseFloat32 = (value) => {
  if (typeof value == "string") {
    return expectFloat32(parseNumber(value));
  }
  return expectFloat32(value);
};
var NUMBER_REGEX = /(-?(?:0|[1-9]\d*)(?:\.\d+)?(?:[eE][+-]?\d+)?)|(-?Infinity)|(NaN)/g;
var parseNumber = (value) => {
  const matches = value.match(NUMBER_REGEX);
  if (matches === null || matches[0].length !== value.length) {
    throw new TypeError(`Expected real number, got implicit NaN`);
  }
  return parseFloat(value);
};
var strictParseInt32 = (value) => {
  if (typeof value === "string") {
    return expectInt32(parseNumber(value));
  }
  return expectInt32(value);
};
var strictParseShort = (value) => {
  if (typeof value === "string") {
    return expectShort(parseNumber(value));
  }
  return expectShort(value);
};
var strictParseByte = (value) => {
  if (typeof value === "string") {
    return expectByte(parseNumber(value));
  }
  return expectByte(value);
};
var stackTraceWarning = (message) => {
  return String(new TypeError(message).stack || message).split("\n").slice(0, 5).filter((s5) => !s5.includes("stackTraceWarning")).join("\n");
};
var logger = {
  warn: console.warn
};

// node_modules/.pnpm/@smithy+smithy-client@2.1.3/node_modules/@smithy/smithy-client/dist-es/date-utils.js
var DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
var MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
function dateToUtcString(date) {
  const year = date.getUTCFullYear();
  const month = date.getUTCMonth();
  const dayOfWeek = date.getUTCDay();
  const dayOfMonthInt = date.getUTCDate();
  const hoursInt = date.getUTCHours();
  const minutesInt = date.getUTCMinutes();
  const secondsInt = date.getUTCSeconds();
  const dayOfMonthString = dayOfMonthInt < 10 ? `0${dayOfMonthInt}` : `${dayOfMonthInt}`;
  const hoursString = hoursInt < 10 ? `0${hoursInt}` : `${hoursInt}`;
  const minutesString = minutesInt < 10 ? `0${minutesInt}` : `${minutesInt}`;
  const secondsString = secondsInt < 10 ? `0${secondsInt}` : `${secondsInt}`;
  return `${DAYS[dayOfWeek]}, ${dayOfMonthString} ${MONTHS[month]} ${year} ${hoursString}:${minutesString}:${secondsString} GMT`;
}
var RFC3339 = new RegExp(/^(\d{4})-(\d{2})-(\d{2})[tT](\d{2}):(\d{2}):(\d{2})(?:\.(\d+))?[zZ]$/);
var RFC3339_WITH_OFFSET = new RegExp(/^(\d{4})-(\d{2})-(\d{2})[tT](\d{2}):(\d{2}):(\d{2})(?:\.(\d+))?(([-+]\d{2}\:\d{2})|[zZ])$/);
var parseRfc3339DateTimeWithOffset = (value) => {
  if (value === null || value === void 0) {
    return void 0;
  }
  if (typeof value !== "string") {
    throw new TypeError("RFC-3339 date-times must be expressed as strings");
  }
  const match = RFC3339_WITH_OFFSET.exec(value);
  if (!match) {
    throw new TypeError("Invalid RFC-3339 date-time value");
  }
  const [_, yearStr, monthStr, dayStr, hours, minutes, seconds, fractionalMilliseconds, offsetStr] = match;
  const year = strictParseShort(stripLeadingZeroes(yearStr));
  const month = parseDateValue(monthStr, "month", 1, 12);
  const day = parseDateValue(dayStr, "day", 1, 31);
  const date = buildDate(year, month, day, { hours, minutes, seconds, fractionalMilliseconds });
  if (offsetStr.toUpperCase() != "Z") {
    date.setTime(date.getTime() - parseOffsetToMilliseconds(offsetStr));
  }
  return date;
};
var IMF_FIXDATE = new RegExp(/^(?:Mon|Tue|Wed|Thu|Fri|Sat|Sun), (\d{2}) (Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec) (\d{4}) (\d{1,2}):(\d{2}):(\d{2})(?:\.(\d+))? GMT$/);
var RFC_850_DATE = new RegExp(/^(?:Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday), (\d{2})-(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)-(\d{2}) (\d{1,2}):(\d{2}):(\d{2})(?:\.(\d+))? GMT$/);
var ASC_TIME = new RegExp(/^(?:Mon|Tue|Wed|Thu|Fri|Sat|Sun) (Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec) ( [1-9]|\d{2}) (\d{1,2}):(\d{2}):(\d{2})(?:\.(\d+))? (\d{4})$/);
var buildDate = (year, month, day, time) => {
  const adjustedMonth = month - 1;
  validateDayOfMonth(year, adjustedMonth, day);
  return new Date(Date.UTC(year, adjustedMonth, day, parseDateValue(time.hours, "hour", 0, 23), parseDateValue(time.minutes, "minute", 0, 59), parseDateValue(time.seconds, "seconds", 0, 60), parseMilliseconds(time.fractionalMilliseconds)));
};
var FIFTY_YEARS_IN_MILLIS = 50 * 365 * 24 * 60 * 60 * 1e3;
var DAYS_IN_MONTH = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
var validateDayOfMonth = (year, month, day) => {
  let maxDays = DAYS_IN_MONTH[month];
  if (month === 1 && isLeapYear(year)) {
    maxDays = 29;
  }
  if (day > maxDays) {
    throw new TypeError(`Invalid day for ${MONTHS[month]} in ${year}: ${day}`);
  }
};
var isLeapYear = (year) => {
  return year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
};
var parseDateValue = (value, type, lower, upper) => {
  const dateVal = strictParseByte(stripLeadingZeroes(value));
  if (dateVal < lower || dateVal > upper) {
    throw new TypeError(`${type} must be between ${lower} and ${upper}, inclusive`);
  }
  return dateVal;
};
var parseMilliseconds = (value) => {
  if (value === null || value === void 0) {
    return 0;
  }
  return strictParseFloat32("0." + value) * 1e3;
};
var parseOffsetToMilliseconds = (value) => {
  const directionStr = value[0];
  let direction = 1;
  if (directionStr == "+") {
    direction = 1;
  } else if (directionStr == "-") {
    direction = -1;
  } else {
    throw new TypeError(`Offset direction, ${directionStr}, must be "+" or "-"`);
  }
  const hour = Number(value.substring(1, 3));
  const minute = Number(value.substring(4, 6));
  return direction * (hour * 60 + minute) * 60 * 1e3;
};
var stripLeadingZeroes = (value) => {
  let idx = 0;
  while (idx < value.length - 1 && value.charAt(idx) === "0") {
    idx++;
  }
  if (idx === 0) {
    return value;
  }
  return value.slice(idx);
};

// node_modules/.pnpm/@smithy+smithy-client@2.1.3/node_modules/@smithy/smithy-client/dist-es/exceptions.js
var ServiceException = class _ServiceException extends Error {
  constructor(options) {
    super(options.message);
    Object.setPrototypeOf(this, _ServiceException.prototype);
    this.name = options.name;
    this.$fault = options.$fault;
    this.$metadata = options.$metadata;
  }
};
var decorateServiceException = (exception, additions = {}) => {
  Object.entries(additions).filter(([, v3]) => v3 !== void 0).forEach(([k5, v3]) => {
    if (exception[k5] == void 0 || exception[k5] === "") {
      exception[k5] = v3;
    }
  });
  const message = exception.message || exception.Message || "UnknownError";
  exception.message = message;
  delete exception.Message;
  return exception;
};

// node_modules/.pnpm/@smithy+smithy-client@2.1.3/node_modules/@smithy/smithy-client/dist-es/default-error-handler.js
var throwDefaultError = ({ output, parsedBody, exceptionCtor, errorCode }) => {
  const $metadata = deserializeMetadata(output);
  const statusCode = $metadata.httpStatusCode ? $metadata.httpStatusCode + "" : void 0;
  const response = new exceptionCtor({
    name: (parsedBody == null ? void 0 : parsedBody.code) || (parsedBody == null ? void 0 : parsedBody.Code) || errorCode || statusCode || "UnknownError",
    $fault: "client",
    $metadata
  });
  throw decorateServiceException(response, parsedBody);
};
var withBaseException = (ExceptionCtor) => {
  return ({ output, parsedBody, errorCode }) => {
    throwDefaultError({ output, parsedBody, exceptionCtor: ExceptionCtor, errorCode });
  };
};
var deserializeMetadata = (output) => {
  var _a, _b;
  return {
    httpStatusCode: output.statusCode,
    requestId: (_b = (_a = output.headers["x-amzn-requestid"]) != null ? _a : output.headers["x-amzn-request-id"]) != null ? _b : output.headers["x-amz-request-id"],
    extendedRequestId: output.headers["x-amz-id-2"],
    cfId: output.headers["x-amz-cf-id"]
  };
};

// node_modules/.pnpm/@smithy+smithy-client@2.1.3/node_modules/@smithy/smithy-client/dist-es/defaults-mode.js
var loadConfigsForDefaultMode = (mode) => {
  switch (mode) {
    case "standard":
      return {
        retryMode: "standard",
        connectionTimeout: 3100
      };
    case "in-region":
      return {
        retryMode: "standard",
        connectionTimeout: 1100
      };
    case "cross-region":
      return {
        retryMode: "standard",
        connectionTimeout: 3100
      };
    case "mobile":
      return {
        retryMode: "standard",
        connectionTimeout: 3e4
      };
    default:
      return {};
  }
};

// node_modules/.pnpm/@smithy+smithy-client@2.1.3/node_modules/@smithy/smithy-client/dist-es/emitWarningIfUnsupportedVersion.js
var warningEmitted = false;
var emitWarningIfUnsupportedVersion = (version) => {
  if (version && !warningEmitted && parseInt(version.substring(1, version.indexOf("."))) < 14) {
    warningEmitted = true;
  }
};

// node_modules/.pnpm/@smithy+smithy-client@2.1.3/node_modules/@smithy/smithy-client/dist-es/extensions/checksum.js
var getChecksumConfiguration2 = (runtimeConfig) => {
  const checksumAlgorithms = [];
  for (const id in AlgorithmId) {
    const algorithmId = AlgorithmId[id];
    if (runtimeConfig[algorithmId] === void 0) {
      continue;
    }
    checksumAlgorithms.push({
      algorithmId: () => algorithmId,
      checksumConstructor: () => runtimeConfig[algorithmId]
    });
  }
  return {
    _checksumAlgorithms: checksumAlgorithms,
    addChecksumAlgorithm(algo) {
      this._checksumAlgorithms.push(algo);
    },
    checksumAlgorithms() {
      return this._checksumAlgorithms;
    }
  };
};
var resolveChecksumRuntimeConfig2 = (clientConfig) => {
  const runtimeConfig = {};
  clientConfig.checksumAlgorithms().forEach((checksumAlgorithm) => {
    runtimeConfig[checksumAlgorithm.algorithmId()] = checksumAlgorithm.checksumConstructor();
  });
  return runtimeConfig;
};

// node_modules/.pnpm/@smithy+smithy-client@2.1.3/node_modules/@smithy/smithy-client/dist-es/extensions/retry.js
var getRetryConfiguration = (runtimeConfig) => {
  let _retryStrategy = runtimeConfig.retryStrategy;
  return {
    setRetryStrategy(retryStrategy) {
      _retryStrategy = retryStrategy;
    },
    retryStrategy() {
      return _retryStrategy;
    }
  };
};
var resolveRetryRuntimeConfig = (retryStrategyConfiguration) => {
  const runtimeConfig = {};
  runtimeConfig.retryStrategy = retryStrategyConfiguration.retryStrategy();
  return runtimeConfig;
};

// node_modules/.pnpm/@smithy+smithy-client@2.1.3/node_modules/@smithy/smithy-client/dist-es/extensions/defaultExtensionConfiguration.js
var getDefaultExtensionConfiguration = (runtimeConfig) => {
  return {
    ...getChecksumConfiguration2(runtimeConfig),
    ...getRetryConfiguration(runtimeConfig)
  };
};
var resolveDefaultRuntimeConfig = (config) => {
  return {
    ...resolveChecksumRuntimeConfig2(config),
    ...resolveRetryRuntimeConfig(config)
  };
};

// node_modules/.pnpm/@smithy+smithy-client@2.1.3/node_modules/@smithy/smithy-client/dist-es/extended-encode-uri-component.js
function extendedEncodeURIComponent(str) {
  return encodeURIComponent(str).replace(/[!'()*]/g, function(c5) {
    return "%" + c5.charCodeAt(0).toString(16).toUpperCase();
  });
}

// node_modules/.pnpm/@smithy+smithy-client@2.1.3/node_modules/@smithy/smithy-client/dist-es/get-value-from-text-node.js
var getValueFromTextNode = (obj) => {
  const textNodeName = "#text";
  for (const key in obj) {
    if (obj.hasOwnProperty(key) && obj[key][textNodeName] !== void 0) {
      obj[key] = obj[key][textNodeName];
    } else if (typeof obj[key] === "object" && obj[key] !== null) {
      obj[key] = getValueFromTextNode(obj[key]);
    }
  }
  return obj;
};

// node_modules/.pnpm/@smithy+smithy-client@2.1.3/node_modules/@smithy/smithy-client/dist-es/lazy-json.js
var StringWrapper = function() {
  const Class = Object.getPrototypeOf(this).constructor;
  const Constructor = Function.bind.apply(String, [null, ...arguments]);
  const instance = new Constructor();
  Object.setPrototypeOf(instance, Class.prototype);
  return instance;
};
StringWrapper.prototype = Object.create(String.prototype, {
  constructor: {
    value: StringWrapper,
    enumerable: false,
    writable: true,
    configurable: true
  }
});
Object.setPrototypeOf(StringWrapper, String);

// node_modules/.pnpm/@smithy+smithy-client@2.1.3/node_modules/@smithy/smithy-client/dist-es/object-mapping.js
function map(arg0, arg1, arg2) {
  let target;
  let filter;
  let instructions;
  if (typeof arg1 === "undefined" && typeof arg2 === "undefined") {
    target = {};
    instructions = arg0;
  } else {
    target = arg0;
    if (typeof arg1 === "function") {
      filter = arg1;
      instructions = arg2;
      return mapWithFilter(target, filter, instructions);
    } else {
      instructions = arg1;
    }
  }
  for (const key of Object.keys(instructions)) {
    if (!Array.isArray(instructions[key])) {
      target[key] = instructions[key];
      continue;
    }
    applyInstruction(target, null, instructions, key);
  }
  return target;
}
var take = (source, instructions) => {
  const out = {};
  for (const key in instructions) {
    applyInstruction(out, source, instructions, key);
  }
  return out;
};
var mapWithFilter = (target, filter, instructions) => {
  return map(target, Object.entries(instructions).reduce((_instructions, [key, value]) => {
    if (Array.isArray(value)) {
      _instructions[key] = value;
    } else {
      if (typeof value === "function") {
        _instructions[key] = [filter, value()];
      } else {
        _instructions[key] = [filter, value];
      }
    }
    return _instructions;
  }, {}));
};
var applyInstruction = (target, source, instructions, targetKey) => {
  if (source !== null) {
    let instruction = instructions[targetKey];
    if (typeof instruction === "function") {
      instruction = [, instruction];
    }
    const [filter2 = nonNullish, valueFn = pass, sourceKey = targetKey] = instruction;
    if (typeof filter2 === "function" && filter2(source[sourceKey]) || typeof filter2 !== "function" && !!filter2) {
      target[targetKey] = valueFn(source[sourceKey]);
    }
    return;
  }
  let [filter, value] = instructions[targetKey];
  if (typeof value === "function") {
    let _value;
    const defaultFilterPassed = filter === void 0 && (_value = value()) != null;
    const customFilterPassed = typeof filter === "function" && !!filter(void 0) || typeof filter !== "function" && !!filter;
    if (defaultFilterPassed) {
      target[targetKey] = _value;
    } else if (customFilterPassed) {
      target[targetKey] = value();
    }
  } else {
    const defaultFilterPassed = filter === void 0 && value != null;
    const customFilterPassed = typeof filter === "function" && !!filter(value) || typeof filter !== "function" && !!filter;
    if (defaultFilterPassed || customFilterPassed) {
      target[targetKey] = value;
    }
  }
};
var nonNullish = (_) => _ != null;
var pass = (_) => _;

// node_modules/.pnpm/@smithy+smithy-client@2.1.3/node_modules/@smithy/smithy-client/dist-es/resolve-path.js
var resolvedPath = (resolvedPath2, input, memberName, labelValueProvider, uriLabel, isGreedyLabel) => {
  if (input != null && input[memberName] !== void 0) {
    const labelValue = labelValueProvider();
    if (labelValue.length <= 0) {
      throw new Error("Empty value provided for input HTTP label: " + memberName + ".");
    }
    resolvedPath2 = resolvedPath2.replace(uriLabel, isGreedyLabel ? labelValue.split("/").map((segment) => extendedEncodeURIComponent(segment)).join("/") : extendedEncodeURIComponent(labelValue));
  } else {
    throw new Error("No value provided for input HTTP label: " + memberName + ".");
  }
  return resolvedPath2;
};

// node_modules/.pnpm/@smithy+smithy-client@2.1.3/node_modules/@smithy/smithy-client/dist-es/serde-json.js
var _json = (obj) => {
  if (obj == null) {
    return {};
  }
  if (Array.isArray(obj)) {
    return obj.filter((_) => _ != null);
  }
  if (typeof obj === "object") {
    const target = {};
    for (const key of Object.keys(obj)) {
      if (obj[key] == null) {
        continue;
      }
      target[key] = _json(obj[key]);
    }
    return target;
  }
  return obj;
};

// node_modules/.pnpm/@aws-sdk+client-s3@3.409.0/node_modules/@aws-sdk/client-s3/dist-es/endpoint/EndpointParameters.js
var resolveClientEndpointParameters = (options) => {
  var _a, _b, _c, _d, _e, _f;
  return {
    ...options,
    useFipsEndpoint: (_a = options.useFipsEndpoint) != null ? _a : false,
    useDualstackEndpoint: (_b = options.useDualstackEndpoint) != null ? _b : false,
    forcePathStyle: (_c = options.forcePathStyle) != null ? _c : false,
    useAccelerateEndpoint: (_d = options.useAccelerateEndpoint) != null ? _d : false,
    useGlobalEndpoint: (_e = options.useGlobalEndpoint) != null ? _e : false,
    disableMultiregionAccessPoints: (_f = options.disableMultiregionAccessPoints) != null ? _f : false,
    defaultSigningName: "s3"
  };
};

// node_modules/.pnpm/@aws-sdk+client-s3@3.409.0/node_modules/@aws-sdk/client-s3/package.json
var package_default = {
  name: "@aws-sdk/client-s3",
  description: "AWS SDK for JavaScript S3 Client for Node.js, Browser and React Native",
  version: "3.409.0",
  scripts: {
    build: "concurrently 'yarn:build:cjs' 'yarn:build:es' 'yarn:build:types'",
    "build:cjs": "tsc -p tsconfig.cjs.json",
    "build:docs": "typedoc",
    "build:es": "tsc -p tsconfig.es.json",
    "build:include:deps": "lerna run --scope $npm_package_name --include-dependencies build",
    "build:types": "tsc -p tsconfig.types.json",
    "build:types:downlevel": "downlevel-dts dist-types dist-types/ts3.4",
    clean: "rimraf ./dist-* && rimraf *.tsbuildinfo",
    "extract:docs": "api-extractor run --local",
    "generate:client": "node ../../scripts/generate-clients/single-service --solo s3",
    test: "yarn test:unit",
    "test:e2e": "ts-mocha test/**/*.ispec.ts && karma start karma.conf.js",
    "test:unit": "ts-mocha test/**/*.spec.ts"
  },
  main: "./dist-cjs/index.js",
  types: "./dist-types/index.d.ts",
  module: "./dist-es/index.js",
  sideEffects: false,
  dependencies: {
    "@aws-crypto/sha1-browser": "3.0.0",
    "@aws-crypto/sha256-browser": "3.0.0",
    "@aws-crypto/sha256-js": "3.0.0",
    "@aws-sdk/client-sts": "3.409.0",
    "@aws-sdk/credential-provider-node": "3.409.0",
    "@aws-sdk/middleware-bucket-endpoint": "3.409.0",
    "@aws-sdk/middleware-expect-continue": "3.408.0",
    "@aws-sdk/middleware-flexible-checksums": "3.408.0",
    "@aws-sdk/middleware-host-header": "3.408.0",
    "@aws-sdk/middleware-location-constraint": "3.408.0",
    "@aws-sdk/middleware-logger": "3.408.0",
    "@aws-sdk/middleware-recursion-detection": "3.408.0",
    "@aws-sdk/middleware-sdk-s3": "3.408.0",
    "@aws-sdk/middleware-signing": "3.408.0",
    "@aws-sdk/middleware-ssec": "3.408.0",
    "@aws-sdk/middleware-user-agent": "3.408.0",
    "@aws-sdk/signature-v4-multi-region": "3.408.0",
    "@aws-sdk/types": "3.408.0",
    "@aws-sdk/util-endpoints": "3.408.0",
    "@aws-sdk/util-user-agent-browser": "3.408.0",
    "@aws-sdk/util-user-agent-node": "3.408.0",
    "@aws-sdk/xml-builder": "3.310.0",
    "@smithy/config-resolver": "^2.0.5",
    "@smithy/eventstream-serde-browser": "^2.0.5",
    "@smithy/eventstream-serde-config-resolver": "^2.0.5",
    "@smithy/eventstream-serde-node": "^2.0.5",
    "@smithy/fetch-http-handler": "^2.0.5",
    "@smithy/hash-blob-browser": "^2.0.5",
    "@smithy/hash-node": "^2.0.5",
    "@smithy/hash-stream-node": "^2.0.5",
    "@smithy/invalid-dependency": "^2.0.5",
    "@smithy/md5-js": "^2.0.5",
    "@smithy/middleware-content-length": "^2.0.5",
    "@smithy/middleware-endpoint": "^2.0.5",
    "@smithy/middleware-retry": "^2.0.5",
    "@smithy/middleware-serde": "^2.0.5",
    "@smithy/middleware-stack": "^2.0.0",
    "@smithy/node-config-provider": "^2.0.6",
    "@smithy/node-http-handler": "^2.0.5",
    "@smithy/protocol-http": "^2.0.5",
    "@smithy/smithy-client": "^2.0.5",
    "@smithy/types": "^2.2.2",
    "@smithy/url-parser": "^2.0.5",
    "@smithy/util-base64": "^2.0.0",
    "@smithy/util-body-length-browser": "^2.0.0",
    "@smithy/util-body-length-node": "^2.1.0",
    "@smithy/util-defaults-mode-browser": "^2.0.6",
    "@smithy/util-defaults-mode-node": "^2.0.6",
    "@smithy/util-retry": "^2.0.0",
    "@smithy/util-stream": "^2.0.5",
    "@smithy/util-utf8": "^2.0.0",
    "@smithy/util-waiter": "^2.0.5",
    "fast-xml-parser": "4.2.5",
    tslib: "^2.5.0"
  },
  devDependencies: {
    "@smithy/service-client-documentation-generator": "^2.0.0",
    "@tsconfig/node14": "1.0.3",
    "@types/chai": "^4.2.11",
    "@types/mocha": "^8.0.4",
    "@types/node": "^14.14.31",
    concurrently: "7.0.0",
    "downlevel-dts": "0.10.1",
    rimraf: "3.0.2",
    typedoc: "0.23.23",
    typescript: "~4.9.5"
  },
  engines: {
    node: ">=14.0.0"
  },
  typesVersions: {
    "<4.0": {
      "dist-types/*": [
        "dist-types/ts3.4/*"
      ]
    }
  },
  files: [
    "dist-*/**"
  ],
  author: {
    name: "AWS SDK for JavaScript Team",
    url: "https://aws.amazon.com/javascript/"
  },
  license: "Apache-2.0",
  browser: {
    "./dist-es/runtimeConfig": "./dist-es/runtimeConfig.browser"
  },
  "react-native": {
    "./dist-es/runtimeConfig": "./dist-es/runtimeConfig.native"
  },
  homepage: "https://github.com/aws/aws-sdk-js-v3/tree/main/clients/client-s3",
  repository: {
    type: "git",
    url: "https://github.com/aws/aws-sdk-js-v3.git",
    directory: "clients/client-s3"
  }
};

// node_modules/.pnpm/@aws-sdk+middleware-sdk-sts@3.408.0/node_modules/@aws-sdk/middleware-sdk-sts/dist-es/index.js
var resolveStsAuthConfig = (input, { stsClientCtor }) => resolveAwsAuthConfig({
  ...input,
  stsClientCtor
});

// node_modules/.pnpm/@aws-sdk+client-sts@3.409.0/node_modules/@aws-sdk/client-sts/dist-es/endpoint/EndpointParameters.js
var resolveClientEndpointParameters2 = (options) => {
  var _a, _b, _c;
  return {
    ...options,
    useDualstackEndpoint: (_a = options.useDualstackEndpoint) != null ? _a : false,
    useFipsEndpoint: (_b = options.useFipsEndpoint) != null ? _b : false,
    useGlobalEndpoint: (_c = options.useGlobalEndpoint) != null ? _c : false,
    defaultSigningName: "sts"
  };
};

// node_modules/.pnpm/@aws-sdk+client-sts@3.409.0/node_modules/@aws-sdk/client-sts/package.json
var package_default2 = {
  name: "@aws-sdk/client-sts",
  description: "AWS SDK for JavaScript Sts Client for Node.js, Browser and React Native",
  version: "3.409.0",
  scripts: {
    build: "concurrently 'yarn:build:cjs' 'yarn:build:es' 'yarn:build:types'",
    "build:cjs": "tsc -p tsconfig.cjs.json",
    "build:docs": "typedoc",
    "build:es": "tsc -p tsconfig.es.json",
    "build:include:deps": "lerna run --scope $npm_package_name --include-dependencies build",
    "build:types": "tsc -p tsconfig.types.json",
    "build:types:downlevel": "downlevel-dts dist-types dist-types/ts3.4",
    clean: "rimraf ./dist-* && rimraf *.tsbuildinfo",
    "extract:docs": "api-extractor run --local",
    "generate:client": "node ../../scripts/generate-clients/single-service --solo sts",
    test: "yarn test:unit",
    "test:unit": "jest"
  },
  main: "./dist-cjs/index.js",
  types: "./dist-types/index.d.ts",
  module: "./dist-es/index.js",
  sideEffects: false,
  dependencies: {
    "@aws-crypto/sha256-browser": "3.0.0",
    "@aws-crypto/sha256-js": "3.0.0",
    "@aws-sdk/credential-provider-node": "3.409.0",
    "@aws-sdk/middleware-host-header": "3.408.0",
    "@aws-sdk/middleware-logger": "3.408.0",
    "@aws-sdk/middleware-recursion-detection": "3.408.0",
    "@aws-sdk/middleware-sdk-sts": "3.408.0",
    "@aws-sdk/middleware-signing": "3.408.0",
    "@aws-sdk/middleware-user-agent": "3.408.0",
    "@aws-sdk/types": "3.408.0",
    "@aws-sdk/util-endpoints": "3.408.0",
    "@aws-sdk/util-user-agent-browser": "3.408.0",
    "@aws-sdk/util-user-agent-node": "3.408.0",
    "@smithy/config-resolver": "^2.0.5",
    "@smithy/fetch-http-handler": "^2.0.5",
    "@smithy/hash-node": "^2.0.5",
    "@smithy/invalid-dependency": "^2.0.5",
    "@smithy/middleware-content-length": "^2.0.5",
    "@smithy/middleware-endpoint": "^2.0.5",
    "@smithy/middleware-retry": "^2.0.5",
    "@smithy/middleware-serde": "^2.0.5",
    "@smithy/middleware-stack": "^2.0.0",
    "@smithy/node-config-provider": "^2.0.6",
    "@smithy/node-http-handler": "^2.0.5",
    "@smithy/protocol-http": "^2.0.5",
    "@smithy/smithy-client": "^2.0.5",
    "@smithy/types": "^2.2.2",
    "@smithy/url-parser": "^2.0.5",
    "@smithy/util-base64": "^2.0.0",
    "@smithy/util-body-length-browser": "^2.0.0",
    "@smithy/util-body-length-node": "^2.1.0",
    "@smithy/util-defaults-mode-browser": "^2.0.6",
    "@smithy/util-defaults-mode-node": "^2.0.6",
    "@smithy/util-retry": "^2.0.0",
    "@smithy/util-utf8": "^2.0.0",
    "fast-xml-parser": "4.2.5",
    tslib: "^2.5.0"
  },
  devDependencies: {
    "@smithy/service-client-documentation-generator": "^2.0.0",
    "@tsconfig/node14": "1.0.3",
    "@types/node": "^14.14.31",
    concurrently: "7.0.0",
    "downlevel-dts": "0.10.1",
    rimraf: "3.0.2",
    typedoc: "0.23.23",
    typescript: "~4.9.5"
  },
  engines: {
    node: ">=14.0.0"
  },
  typesVersions: {
    "<4.0": {
      "dist-types/*": [
        "dist-types/ts3.4/*"
      ]
    }
  },
  files: [
    "dist-*/**"
  ],
  author: {
    name: "AWS SDK for JavaScript Team",
    url: "https://aws.amazon.com/javascript/"
  },
  license: "Apache-2.0",
  browser: {
    "./dist-es/runtimeConfig": "./dist-es/runtimeConfig.browser"
  },
  "react-native": {
    "./dist-es/runtimeConfig": "./dist-es/runtimeConfig.native"
  },
  homepage: "https://github.com/aws/aws-sdk-js-v3/tree/main/clients/client-sts",
  repository: {
    type: "git",
    url: "https://github.com/aws/aws-sdk-js-v3.git",
    directory: "clients/client-sts"
  }
};

// node_modules/.pnpm/@aws-sdk+client-sts@3.409.0/node_modules/@aws-sdk/client-sts/dist-es/models/STSServiceException.js
var STSServiceException = class _STSServiceException extends ServiceException {
  constructor(options) {
    super(options);
    Object.setPrototypeOf(this, _STSServiceException.prototype);
  }
};

// node_modules/.pnpm/@aws-sdk+client-sts@3.409.0/node_modules/@aws-sdk/client-sts/dist-es/models/models_0.js
var ExpiredTokenException = class _ExpiredTokenException2 extends STSServiceException {
  constructor(opts) {
    super({
      name: "ExpiredTokenException",
      $fault: "client",
      ...opts
    });
    this.name = "ExpiredTokenException";
    this.$fault = "client";
    Object.setPrototypeOf(this, _ExpiredTokenException2.prototype);
  }
};
var MalformedPolicyDocumentException = class _MalformedPolicyDocumentException extends STSServiceException {
  constructor(opts) {
    super({
      name: "MalformedPolicyDocumentException",
      $fault: "client",
      ...opts
    });
    this.name = "MalformedPolicyDocumentException";
    this.$fault = "client";
    Object.setPrototypeOf(this, _MalformedPolicyDocumentException.prototype);
  }
};
var PackedPolicyTooLargeException = class _PackedPolicyTooLargeException extends STSServiceException {
  constructor(opts) {
    super({
      name: "PackedPolicyTooLargeException",
      $fault: "client",
      ...opts
    });
    this.name = "PackedPolicyTooLargeException";
    this.$fault = "client";
    Object.setPrototypeOf(this, _PackedPolicyTooLargeException.prototype);
  }
};
var RegionDisabledException = class _RegionDisabledException extends STSServiceException {
  constructor(opts) {
    super({
      name: "RegionDisabledException",
      $fault: "client",
      ...opts
    });
    this.name = "RegionDisabledException";
    this.$fault = "client";
    Object.setPrototypeOf(this, _RegionDisabledException.prototype);
  }
};
var IDPRejectedClaimException = class _IDPRejectedClaimException extends STSServiceException {
  constructor(opts) {
    super({
      name: "IDPRejectedClaimException",
      $fault: "client",
      ...opts
    });
    this.name = "IDPRejectedClaimException";
    this.$fault = "client";
    Object.setPrototypeOf(this, _IDPRejectedClaimException.prototype);
  }
};
var InvalidIdentityTokenException = class _InvalidIdentityTokenException extends STSServiceException {
  constructor(opts) {
    super({
      name: "InvalidIdentityTokenException",
      $fault: "client",
      ...opts
    });
    this.name = "InvalidIdentityTokenException";
    this.$fault = "client";
    Object.setPrototypeOf(this, _InvalidIdentityTokenException.prototype);
  }
};
var IDPCommunicationErrorException = class _IDPCommunicationErrorException extends STSServiceException {
  constructor(opts) {
    super({
      name: "IDPCommunicationErrorException",
      $fault: "client",
      ...opts
    });
    this.name = "IDPCommunicationErrorException";
    this.$fault = "client";
    Object.setPrototypeOf(this, _IDPCommunicationErrorException.prototype);
  }
};
var CredentialsFilterSensitiveLog = (obj) => ({
  ...obj,
  ...obj.SecretAccessKey && { SecretAccessKey: SENSITIVE_STRING }
});
var AssumeRoleResponseFilterSensitiveLog = (obj) => ({
  ...obj,
  ...obj.Credentials && { Credentials: CredentialsFilterSensitiveLog(obj.Credentials) }
});
var AssumeRoleWithWebIdentityRequestFilterSensitiveLog = (obj) => ({
  ...obj,
  ...obj.WebIdentityToken && { WebIdentityToken: SENSITIVE_STRING }
});
var AssumeRoleWithWebIdentityResponseFilterSensitiveLog = (obj) => ({
  ...obj,
  ...obj.Credentials && { Credentials: CredentialsFilterSensitiveLog(obj.Credentials) }
});

// node_modules/.pnpm/@aws-sdk+client-sts@3.409.0/node_modules/@aws-sdk/client-sts/dist-es/protocols/Aws_query.js
var import_fast_xml_parser = __toESM(require_fxp());
var se_AssumeRoleCommand = async (input, context) => {
  const headers = SHARED_HEADERS;
  let body;
  body = buildFormUrlencodedString({
    ...se_AssumeRoleRequest(input, context),
    Action: "AssumeRole",
    Version: "2011-06-15"
  });
  return buildHttpRpcRequest(context, headers, "/", void 0, body);
};
var se_AssumeRoleWithWebIdentityCommand = async (input, context) => {
  const headers = SHARED_HEADERS;
  let body;
  body = buildFormUrlencodedString({
    ...se_AssumeRoleWithWebIdentityRequest(input, context),
    Action: "AssumeRoleWithWebIdentity",
    Version: "2011-06-15"
  });
  return buildHttpRpcRequest(context, headers, "/", void 0, body);
};
var de_AssumeRoleCommand = async (output, context) => {
  if (output.statusCode >= 300) {
    return de_AssumeRoleCommandError(output, context);
  }
  const data = await parseBody(output.body, context);
  let contents = {};
  contents = de_AssumeRoleResponse(data.AssumeRoleResult, context);
  const response = {
    $metadata: deserializeMetadata2(output),
    ...contents
  };
  return response;
};
var de_AssumeRoleCommandError = async (output, context) => {
  const parsedOutput = {
    ...output,
    body: await parseErrorBody(output.body, context)
  };
  const errorCode = loadQueryErrorCode(output, parsedOutput.body);
  switch (errorCode) {
    case "ExpiredTokenException":
    case "com.amazonaws.sts#ExpiredTokenException":
      throw await de_ExpiredTokenExceptionRes(parsedOutput, context);
    case "MalformedPolicyDocument":
    case "com.amazonaws.sts#MalformedPolicyDocumentException":
      throw await de_MalformedPolicyDocumentExceptionRes(parsedOutput, context);
    case "PackedPolicyTooLarge":
    case "com.amazonaws.sts#PackedPolicyTooLargeException":
      throw await de_PackedPolicyTooLargeExceptionRes(parsedOutput, context);
    case "RegionDisabledException":
    case "com.amazonaws.sts#RegionDisabledException":
      throw await de_RegionDisabledExceptionRes(parsedOutput, context);
    default:
      const parsedBody = parsedOutput.body;
      return throwDefaultError2({
        output,
        parsedBody: parsedBody.Error,
        errorCode
      });
  }
};
var de_AssumeRoleWithWebIdentityCommand = async (output, context) => {
  if (output.statusCode >= 300) {
    return de_AssumeRoleWithWebIdentityCommandError(output, context);
  }
  const data = await parseBody(output.body, context);
  let contents = {};
  contents = de_AssumeRoleWithWebIdentityResponse(data.AssumeRoleWithWebIdentityResult, context);
  const response = {
    $metadata: deserializeMetadata2(output),
    ...contents
  };
  return response;
};
var de_AssumeRoleWithWebIdentityCommandError = async (output, context) => {
  const parsedOutput = {
    ...output,
    body: await parseErrorBody(output.body, context)
  };
  const errorCode = loadQueryErrorCode(output, parsedOutput.body);
  switch (errorCode) {
    case "ExpiredTokenException":
    case "com.amazonaws.sts#ExpiredTokenException":
      throw await de_ExpiredTokenExceptionRes(parsedOutput, context);
    case "IDPCommunicationError":
    case "com.amazonaws.sts#IDPCommunicationErrorException":
      throw await de_IDPCommunicationErrorExceptionRes(parsedOutput, context);
    case "IDPRejectedClaim":
    case "com.amazonaws.sts#IDPRejectedClaimException":
      throw await de_IDPRejectedClaimExceptionRes(parsedOutput, context);
    case "InvalidIdentityToken":
    case "com.amazonaws.sts#InvalidIdentityTokenException":
      throw await de_InvalidIdentityTokenExceptionRes(parsedOutput, context);
    case "MalformedPolicyDocument":
    case "com.amazonaws.sts#MalformedPolicyDocumentException":
      throw await de_MalformedPolicyDocumentExceptionRes(parsedOutput, context);
    case "PackedPolicyTooLarge":
    case "com.amazonaws.sts#PackedPolicyTooLargeException":
      throw await de_PackedPolicyTooLargeExceptionRes(parsedOutput, context);
    case "RegionDisabledException":
    case "com.amazonaws.sts#RegionDisabledException":
      throw await de_RegionDisabledExceptionRes(parsedOutput, context);
    default:
      const parsedBody = parsedOutput.body;
      return throwDefaultError2({
        output,
        parsedBody: parsedBody.Error,
        errorCode
      });
  }
};
var de_ExpiredTokenExceptionRes = async (parsedOutput, context) => {
  const body = parsedOutput.body;
  const deserialized = de_ExpiredTokenException(body.Error, context);
  const exception = new ExpiredTokenException({
    $metadata: deserializeMetadata2(parsedOutput),
    ...deserialized
  });
  return decorateServiceException(exception, body);
};
var de_IDPCommunicationErrorExceptionRes = async (parsedOutput, context) => {
  const body = parsedOutput.body;
  const deserialized = de_IDPCommunicationErrorException(body.Error, context);
  const exception = new IDPCommunicationErrorException({
    $metadata: deserializeMetadata2(parsedOutput),
    ...deserialized
  });
  return decorateServiceException(exception, body);
};
var de_IDPRejectedClaimExceptionRes = async (parsedOutput, context) => {
  const body = parsedOutput.body;
  const deserialized = de_IDPRejectedClaimException(body.Error, context);
  const exception = new IDPRejectedClaimException({
    $metadata: deserializeMetadata2(parsedOutput),
    ...deserialized
  });
  return decorateServiceException(exception, body);
};
var de_InvalidIdentityTokenExceptionRes = async (parsedOutput, context) => {
  const body = parsedOutput.body;
  const deserialized = de_InvalidIdentityTokenException(body.Error, context);
  const exception = new InvalidIdentityTokenException({
    $metadata: deserializeMetadata2(parsedOutput),
    ...deserialized
  });
  return decorateServiceException(exception, body);
};
var de_MalformedPolicyDocumentExceptionRes = async (parsedOutput, context) => {
  const body = parsedOutput.body;
  const deserialized = de_MalformedPolicyDocumentException(body.Error, context);
  const exception = new MalformedPolicyDocumentException({
    $metadata: deserializeMetadata2(parsedOutput),
    ...deserialized
  });
  return decorateServiceException(exception, body);
};
var de_PackedPolicyTooLargeExceptionRes = async (parsedOutput, context) => {
  const body = parsedOutput.body;
  const deserialized = de_PackedPolicyTooLargeException(body.Error, context);
  const exception = new PackedPolicyTooLargeException({
    $metadata: deserializeMetadata2(parsedOutput),
    ...deserialized
  });
  return decorateServiceException(exception, body);
};
var de_RegionDisabledExceptionRes = async (parsedOutput, context) => {
  const body = parsedOutput.body;
  const deserialized = de_RegionDisabledException(body.Error, context);
  const exception = new RegionDisabledException({
    $metadata: deserializeMetadata2(parsedOutput),
    ...deserialized
  });
  return decorateServiceException(exception, body);
};
var se_AssumeRoleRequest = (input, context) => {
  var _a, _b, _c, _d;
  const entries = {};
  if (input.RoleArn != null) {
    entries["RoleArn"] = input.RoleArn;
  }
  if (input.RoleSessionName != null) {
    entries["RoleSessionName"] = input.RoleSessionName;
  }
  if (input.PolicyArns != null) {
    const memberEntries = se_policyDescriptorListType(input.PolicyArns, context);
    if (((_a = input.PolicyArns) == null ? void 0 : _a.length) === 0) {
      entries.PolicyArns = [];
    }
    Object.entries(memberEntries).forEach(([key, value]) => {
      const loc = `PolicyArns.${key}`;
      entries[loc] = value;
    });
  }
  if (input.Policy != null) {
    entries["Policy"] = input.Policy;
  }
  if (input.DurationSeconds != null) {
    entries["DurationSeconds"] = input.DurationSeconds;
  }
  if (input.Tags != null) {
    const memberEntries = se_tagListType(input.Tags, context);
    if (((_b = input.Tags) == null ? void 0 : _b.length) === 0) {
      entries.Tags = [];
    }
    Object.entries(memberEntries).forEach(([key, value]) => {
      const loc = `Tags.${key}`;
      entries[loc] = value;
    });
  }
  if (input.TransitiveTagKeys != null) {
    const memberEntries = se_tagKeyListType(input.TransitiveTagKeys, context);
    if (((_c = input.TransitiveTagKeys) == null ? void 0 : _c.length) === 0) {
      entries.TransitiveTagKeys = [];
    }
    Object.entries(memberEntries).forEach(([key, value]) => {
      const loc = `TransitiveTagKeys.${key}`;
      entries[loc] = value;
    });
  }
  if (input.ExternalId != null) {
    entries["ExternalId"] = input.ExternalId;
  }
  if (input.SerialNumber != null) {
    entries["SerialNumber"] = input.SerialNumber;
  }
  if (input.TokenCode != null) {
    entries["TokenCode"] = input.TokenCode;
  }
  if (input.SourceIdentity != null) {
    entries["SourceIdentity"] = input.SourceIdentity;
  }
  if (input.ProvidedContexts != null) {
    const memberEntries = se_ProvidedContextsListType(input.ProvidedContexts, context);
    if (((_d = input.ProvidedContexts) == null ? void 0 : _d.length) === 0) {
      entries.ProvidedContexts = [];
    }
    Object.entries(memberEntries).forEach(([key, value]) => {
      const loc = `ProvidedContexts.${key}`;
      entries[loc] = value;
    });
  }
  return entries;
};
var se_AssumeRoleWithWebIdentityRequest = (input, context) => {
  var _a;
  const entries = {};
  if (input.RoleArn != null) {
    entries["RoleArn"] = input.RoleArn;
  }
  if (input.RoleSessionName != null) {
    entries["RoleSessionName"] = input.RoleSessionName;
  }
  if (input.WebIdentityToken != null) {
    entries["WebIdentityToken"] = input.WebIdentityToken;
  }
  if (input.ProviderId != null) {
    entries["ProviderId"] = input.ProviderId;
  }
  if (input.PolicyArns != null) {
    const memberEntries = se_policyDescriptorListType(input.PolicyArns, context);
    if (((_a = input.PolicyArns) == null ? void 0 : _a.length) === 0) {
      entries.PolicyArns = [];
    }
    Object.entries(memberEntries).forEach(([key, value]) => {
      const loc = `PolicyArns.${key}`;
      entries[loc] = value;
    });
  }
  if (input.Policy != null) {
    entries["Policy"] = input.Policy;
  }
  if (input.DurationSeconds != null) {
    entries["DurationSeconds"] = input.DurationSeconds;
  }
  return entries;
};
var se_policyDescriptorListType = (input, context) => {
  const entries = {};
  let counter = 1;
  for (const entry of input) {
    if (entry === null) {
      continue;
    }
    const memberEntries = se_PolicyDescriptorType(entry, context);
    Object.entries(memberEntries).forEach(([key, value]) => {
      entries[`member.${counter}.${key}`] = value;
    });
    counter++;
  }
  return entries;
};
var se_PolicyDescriptorType = (input, context) => {
  const entries = {};
  if (input.arn != null) {
    entries["arn"] = input.arn;
  }
  return entries;
};
var se_ProvidedContext = (input, context) => {
  const entries = {};
  if (input.ProviderArn != null) {
    entries["ProviderArn"] = input.ProviderArn;
  }
  if (input.ContextAssertion != null) {
    entries["ContextAssertion"] = input.ContextAssertion;
  }
  return entries;
};
var se_ProvidedContextsListType = (input, context) => {
  const entries = {};
  let counter = 1;
  for (const entry of input) {
    if (entry === null) {
      continue;
    }
    const memberEntries = se_ProvidedContext(entry, context);
    Object.entries(memberEntries).forEach(([key, value]) => {
      entries[`member.${counter}.${key}`] = value;
    });
    counter++;
  }
  return entries;
};
var se_Tag = (input, context) => {
  const entries = {};
  if (input.Key != null) {
    entries["Key"] = input.Key;
  }
  if (input.Value != null) {
    entries["Value"] = input.Value;
  }
  return entries;
};
var se_tagKeyListType = (input, context) => {
  const entries = {};
  let counter = 1;
  for (const entry of input) {
    if (entry === null) {
      continue;
    }
    entries[`member.${counter}`] = entry;
    counter++;
  }
  return entries;
};
var se_tagListType = (input, context) => {
  const entries = {};
  let counter = 1;
  for (const entry of input) {
    if (entry === null) {
      continue;
    }
    const memberEntries = se_Tag(entry, context);
    Object.entries(memberEntries).forEach(([key, value]) => {
      entries[`member.${counter}.${key}`] = value;
    });
    counter++;
  }
  return entries;
};
var de_AssumedRoleUser = (output, context) => {
  const contents = {};
  if (output["AssumedRoleId"] !== void 0) {
    contents.AssumedRoleId = expectString(output["AssumedRoleId"]);
  }
  if (output["Arn"] !== void 0) {
    contents.Arn = expectString(output["Arn"]);
  }
  return contents;
};
var de_AssumeRoleResponse = (output, context) => {
  const contents = {};
  if (output["Credentials"] !== void 0) {
    contents.Credentials = de_Credentials(output["Credentials"], context);
  }
  if (output["AssumedRoleUser"] !== void 0) {
    contents.AssumedRoleUser = de_AssumedRoleUser(output["AssumedRoleUser"], context);
  }
  if (output["PackedPolicySize"] !== void 0) {
    contents.PackedPolicySize = strictParseInt32(output["PackedPolicySize"]);
  }
  if (output["SourceIdentity"] !== void 0) {
    contents.SourceIdentity = expectString(output["SourceIdentity"]);
  }
  return contents;
};
var de_AssumeRoleWithWebIdentityResponse = (output, context) => {
  const contents = {};
  if (output["Credentials"] !== void 0) {
    contents.Credentials = de_Credentials(output["Credentials"], context);
  }
  if (output["SubjectFromWebIdentityToken"] !== void 0) {
    contents.SubjectFromWebIdentityToken = expectString(output["SubjectFromWebIdentityToken"]);
  }
  if (output["AssumedRoleUser"] !== void 0) {
    contents.AssumedRoleUser = de_AssumedRoleUser(output["AssumedRoleUser"], context);
  }
  if (output["PackedPolicySize"] !== void 0) {
    contents.PackedPolicySize = strictParseInt32(output["PackedPolicySize"]);
  }
  if (output["Provider"] !== void 0) {
    contents.Provider = expectString(output["Provider"]);
  }
  if (output["Audience"] !== void 0) {
    contents.Audience = expectString(output["Audience"]);
  }
  if (output["SourceIdentity"] !== void 0) {
    contents.SourceIdentity = expectString(output["SourceIdentity"]);
  }
  return contents;
};
var de_Credentials = (output, context) => {
  const contents = {};
  if (output["AccessKeyId"] !== void 0) {
    contents.AccessKeyId = expectString(output["AccessKeyId"]);
  }
  if (output["SecretAccessKey"] !== void 0) {
    contents.SecretAccessKey = expectString(output["SecretAccessKey"]);
  }
  if (output["SessionToken"] !== void 0) {
    contents.SessionToken = expectString(output["SessionToken"]);
  }
  if (output["Expiration"] !== void 0) {
    contents.Expiration = expectNonNull(parseRfc3339DateTimeWithOffset(output["Expiration"]));
  }
  return contents;
};
var de_ExpiredTokenException = (output, context) => {
  const contents = {};
  if (output["message"] !== void 0) {
    contents.message = expectString(output["message"]);
  }
  return contents;
};
var de_IDPCommunicationErrorException = (output, context) => {
  const contents = {};
  if (output["message"] !== void 0) {
    contents.message = expectString(output["message"]);
  }
  return contents;
};
var de_IDPRejectedClaimException = (output, context) => {
  const contents = {};
  if (output["message"] !== void 0) {
    contents.message = expectString(output["message"]);
  }
  return contents;
};
var de_InvalidIdentityTokenException = (output, context) => {
  const contents = {};
  if (output["message"] !== void 0) {
    contents.message = expectString(output["message"]);
  }
  return contents;
};
var de_MalformedPolicyDocumentException = (output, context) => {
  const contents = {};
  if (output["message"] !== void 0) {
    contents.message = expectString(output["message"]);
  }
  return contents;
};
var de_PackedPolicyTooLargeException = (output, context) => {
  const contents = {};
  if (output["message"] !== void 0) {
    contents.message = expectString(output["message"]);
  }
  return contents;
};
var de_RegionDisabledException = (output, context) => {
  const contents = {};
  if (output["message"] !== void 0) {
    contents.message = expectString(output["message"]);
  }
  return contents;
};
var deserializeMetadata2 = (output) => {
  var _a, _b;
  return {
    httpStatusCode: output.statusCode,
    requestId: (_b = (_a = output.headers["x-amzn-requestid"]) != null ? _a : output.headers["x-amzn-request-id"]) != null ? _b : output.headers["x-amz-request-id"],
    extendedRequestId: output.headers["x-amz-id-2"],
    cfId: output.headers["x-amz-cf-id"]
  };
};
var collectBodyString = (streamBody, context) => collectBody(streamBody, context).then((body) => context.utf8Encoder(body));
var throwDefaultError2 = withBaseException(STSServiceException);
var buildHttpRpcRequest = async (context, headers, path, resolvedHostname, body) => {
  const { hostname, protocol = "https", port, path: basePath } = await context.endpoint();
  const contents = {
    protocol,
    hostname,
    port,
    method: "POST",
    path: basePath.endsWith("/") ? basePath.slice(0, -1) + path : basePath + path,
    headers
  };
  if (resolvedHostname !== void 0) {
    contents.hostname = resolvedHostname;
  }
  if (body !== void 0) {
    contents.body = body;
  }
  return new HttpRequest(contents);
};
var SHARED_HEADERS = {
  "content-type": "application/x-www-form-urlencoded"
};
var parseBody = (streamBody, context) => collectBodyString(streamBody, context).then((encoded) => {
  if (encoded.length) {
    const parser = new import_fast_xml_parser.XMLParser({
      attributeNamePrefix: "",
      htmlEntities: true,
      ignoreAttributes: false,
      ignoreDeclaration: true,
      parseTagValue: false,
      trimValues: false,
      tagValueProcessor: (_, val2) => val2.trim() === "" && val2.includes("\n") ? "" : void 0
    });
    parser.addEntity("#xD", "\r");
    parser.addEntity("#10", "\n");
    const parsedObj = parser.parse(encoded);
    const textNodeName = "#text";
    const key = Object.keys(parsedObj)[0];
    const parsedObjToReturn = parsedObj[key];
    if (parsedObjToReturn[textNodeName]) {
      parsedObjToReturn[key] = parsedObjToReturn[textNodeName];
      delete parsedObjToReturn[textNodeName];
    }
    return getValueFromTextNode(parsedObjToReturn);
  }
  return {};
});
var parseErrorBody = async (errorBody, context) => {
  var _a;
  const value = await parseBody(errorBody, context);
  if (value.Error) {
    value.Error.message = (_a = value.Error.message) != null ? _a : value.Error.Message;
  }
  return value;
};
var buildFormUrlencodedString = (formEntries) => Object.entries(formEntries).map(([key, value]) => extendedEncodeURIComponent(key) + "=" + extendedEncodeURIComponent(value)).join("&");
var loadQueryErrorCode = (output, data) => {
  var _a;
  if (((_a = data.Error) == null ? void 0 : _a.Code) !== void 0) {
    return data.Error.Code;
  }
  if (output.statusCode == 404) {
    return "NotFound";
  }
};

// node_modules/.pnpm/@aws-sdk+client-sts@3.409.0/node_modules/@aws-sdk/client-sts/dist-es/commands/AssumeRoleCommand.js
var AssumeRoleCommand = class _AssumeRoleCommand extends Command {
  static getEndpointParameterInstructions() {
    return {
      UseGlobalEndpoint: { type: "builtInParams", name: "useGlobalEndpoint" },
      UseFIPS: { type: "builtInParams", name: "useFipsEndpoint" },
      Endpoint: { type: "builtInParams", name: "endpoint" },
      Region: { type: "builtInParams", name: "region" },
      UseDualStack: { type: "builtInParams", name: "useDualstackEndpoint" }
    };
  }
  constructor(input) {
    super();
    this.input = input;
  }
  resolveMiddleware(clientStack, configuration, options) {
    this.middlewareStack.use(getSerdePlugin(configuration, this.serialize, this.deserialize));
    this.middlewareStack.use(getEndpointPlugin(configuration, _AssumeRoleCommand.getEndpointParameterInstructions()));
    this.middlewareStack.use(getAwsAuthPlugin(configuration));
    const stack = clientStack.concat(this.middlewareStack);
    const { logger: logger2 } = configuration;
    const clientName = "STSClient";
    const commandName = "AssumeRoleCommand";
    const handlerExecutionContext = {
      logger: logger2,
      clientName,
      commandName,
      inputFilterSensitiveLog: (_) => _,
      outputFilterSensitiveLog: AssumeRoleResponseFilterSensitiveLog
    };
    const { requestHandler } = configuration;
    return stack.resolve((request2) => requestHandler.handle(request2.request, options || {}), handlerExecutionContext);
  }
  serialize(input, context) {
    return se_AssumeRoleCommand(input, context);
  }
  deserialize(output, context) {
    return de_AssumeRoleCommand(output, context);
  }
};

// node_modules/.pnpm/@aws-sdk+client-sts@3.409.0/node_modules/@aws-sdk/client-sts/dist-es/commands/AssumeRoleWithWebIdentityCommand.js
var AssumeRoleWithWebIdentityCommand = class _AssumeRoleWithWebIdentityCommand extends Command {
  static getEndpointParameterInstructions() {
    return {
      UseGlobalEndpoint: { type: "builtInParams", name: "useGlobalEndpoint" },
      UseFIPS: { type: "builtInParams", name: "useFipsEndpoint" },
      Endpoint: { type: "builtInParams", name: "endpoint" },
      Region: { type: "builtInParams", name: "region" },
      UseDualStack: { type: "builtInParams", name: "useDualstackEndpoint" }
    };
  }
  constructor(input) {
    super();
    this.input = input;
  }
  resolveMiddleware(clientStack, configuration, options) {
    this.middlewareStack.use(getSerdePlugin(configuration, this.serialize, this.deserialize));
    this.middlewareStack.use(getEndpointPlugin(configuration, _AssumeRoleWithWebIdentityCommand.getEndpointParameterInstructions()));
    const stack = clientStack.concat(this.middlewareStack);
    const { logger: logger2 } = configuration;
    const clientName = "STSClient";
    const commandName = "AssumeRoleWithWebIdentityCommand";
    const handlerExecutionContext = {
      logger: logger2,
      clientName,
      commandName,
      inputFilterSensitiveLog: AssumeRoleWithWebIdentityRequestFilterSensitiveLog,
      outputFilterSensitiveLog: AssumeRoleWithWebIdentityResponseFilterSensitiveLog
    };
    const { requestHandler } = configuration;
    return stack.resolve((request2) => requestHandler.handle(request2.request, options || {}), handlerExecutionContext);
  }
  serialize(input, context) {
    return se_AssumeRoleWithWebIdentityCommand(input, context);
  }
  deserialize(output, context) {
    return de_AssumeRoleWithWebIdentityCommand(output, context);
  }
};

// node_modules/.pnpm/@aws-sdk+client-sts@3.409.0/node_modules/@aws-sdk/client-sts/dist-es/defaultStsRoleAssumers.js
var ASSUME_ROLE_DEFAULT_REGION = "us-east-1";
var decorateDefaultRegion = (region) => {
  if (typeof region !== "function") {
    return region === void 0 ? ASSUME_ROLE_DEFAULT_REGION : region;
  }
  return async () => {
    try {
      return await region();
    } catch (e5) {
      return ASSUME_ROLE_DEFAULT_REGION;
    }
  };
};
var getDefaultRoleAssumer = (stsOptions, stsClientCtor) => {
  let stsClient;
  let closureSourceCreds;
  return async (sourceCreds, params) => {
    closureSourceCreds = sourceCreds;
    if (!stsClient) {
      const { logger: logger2, region, requestHandler } = stsOptions;
      stsClient = new stsClientCtor({
        logger: logger2,
        credentialDefaultProvider: () => async () => closureSourceCreds,
        region: decorateDefaultRegion(region || stsOptions.region),
        ...requestHandler ? { requestHandler } : {}
      });
    }
    const { Credentials } = await stsClient.send(new AssumeRoleCommand(params));
    if (!Credentials || !Credentials.AccessKeyId || !Credentials.SecretAccessKey) {
      throw new Error(`Invalid response from STS.assumeRole call with role ${params.RoleArn}`);
    }
    return {
      accessKeyId: Credentials.AccessKeyId,
      secretAccessKey: Credentials.SecretAccessKey,
      sessionToken: Credentials.SessionToken,
      expiration: Credentials.Expiration
    };
  };
};
var getDefaultRoleAssumerWithWebIdentity = (stsOptions, stsClientCtor) => {
  let stsClient;
  return async (params) => {
    if (!stsClient) {
      const { logger: logger2, region, requestHandler } = stsOptions;
      stsClient = new stsClientCtor({
        logger: logger2,
        region: decorateDefaultRegion(region || stsOptions.region),
        ...requestHandler ? { requestHandler } : {}
      });
    }
    const { Credentials } = await stsClient.send(new AssumeRoleWithWebIdentityCommand(params));
    if (!Credentials || !Credentials.AccessKeyId || !Credentials.SecretAccessKey) {
      throw new Error(`Invalid response from STS.assumeRoleWithWebIdentity call with role ${params.RoleArn}`);
    }
    return {
      accessKeyId: Credentials.AccessKeyId,
      secretAccessKey: Credentials.SecretAccessKey,
      sessionToken: Credentials.SessionToken,
      expiration: Credentials.Expiration
    };
  };
};
var decorateDefaultCredentialProvider = (provider) => (input) => provider({
  roleAssumer: getDefaultRoleAssumer(input, input.stsClientCtor),
  roleAssumerWithWebIdentity: getDefaultRoleAssumerWithWebIdentity(input, input.stsClientCtor),
  ...input
});

// node_modules/.pnpm/@aws-sdk+credential-provider-env@3.408.0/node_modules/@aws-sdk/credential-provider-env/dist-es/fromEnv.js
var ENV_KEY = "AWS_ACCESS_KEY_ID";
var ENV_SECRET = "AWS_SECRET_ACCESS_KEY";
var ENV_SESSION = "AWS_SESSION_TOKEN";
var ENV_EXPIRATION = "AWS_CREDENTIAL_EXPIRATION";
var fromEnv = () => async () => {
  const accessKeyId = process.env[ENV_KEY];
  const secretAccessKey = process.env[ENV_SECRET];
  const sessionToken = process.env[ENV_SESSION];
  const expiry = process.env[ENV_EXPIRATION];
  if (accessKeyId && secretAccessKey) {
    return {
      accessKeyId,
      secretAccessKey,
      ...sessionToken && { sessionToken },
      ...expiry && { expiration: new Date(expiry) }
    };
  }
  throw new CredentialsProviderError("Unable to find environment variable credentials.");
};

// node_modules/.pnpm/@smithy+shared-ini-file-loader@2.0.8/node_modules/@smithy/shared-ini-file-loader/dist-es/getHomeDir.js
var import_os2 = require("os");
var import_path2 = require("path");
var homeDirCache = {};
var getHomeDirCacheKey = () => {
  if (process && process.geteuid) {
    return `${process.geteuid()}`;
  }
  return "DEFAULT";
};
var getHomeDir = () => {
  const { HOME, USERPROFILE, HOMEPATH, HOMEDRIVE = `C:${import_path2.sep}` } = process.env;
  if (HOME)
    return HOME;
  if (USERPROFILE)
    return USERPROFILE;
  if (HOMEPATH)
    return `${HOMEDRIVE}${HOMEPATH}`;
  const homeDirCacheKey = getHomeDirCacheKey();
  if (!homeDirCache[homeDirCacheKey])
    homeDirCache[homeDirCacheKey] = (0, import_os2.homedir)();
  return homeDirCache[homeDirCacheKey];
};

// node_modules/.pnpm/@smithy+shared-ini-file-loader@2.0.8/node_modules/@smithy/shared-ini-file-loader/dist-es/getProfileName.js
var ENV_PROFILE = "AWS_PROFILE";
var DEFAULT_PROFILE = "default";
var getProfileName = (init) => init.profile || process.env[ENV_PROFILE] || DEFAULT_PROFILE;

// node_modules/.pnpm/@smithy+shared-ini-file-loader@2.0.8/node_modules/@smithy/shared-ini-file-loader/dist-es/getSSOTokenFilepath.js
var import_crypto2 = require("crypto");
var import_path3 = require("path");
var getSSOTokenFilepath = (id) => {
  const hasher = (0, import_crypto2.createHash)("sha1");
  const cacheName = hasher.update(id).digest("hex");
  return (0, import_path3.join)(getHomeDir(), ".aws", "sso", "cache", `${cacheName}.json`);
};

// node_modules/.pnpm/@smithy+shared-ini-file-loader@2.0.8/node_modules/@smithy/shared-ini-file-loader/dist-es/getSSOTokenFromFile.js
var import_fs = require("fs");
var { readFile } = import_fs.promises;
var getSSOTokenFromFile = async (id) => {
  const ssoTokenFilepath = getSSOTokenFilepath(id);
  const ssoTokenText = await readFile(ssoTokenFilepath, "utf8");
  return JSON.parse(ssoTokenText);
};

// node_modules/.pnpm/@smithy+shared-ini-file-loader@2.0.8/node_modules/@smithy/shared-ini-file-loader/dist-es/getConfigFilepath.js
var import_path4 = require("path");
var ENV_CONFIG_PATH = "AWS_CONFIG_FILE";
var getConfigFilepath = () => process.env[ENV_CONFIG_PATH] || (0, import_path4.join)(getHomeDir(), ".aws", "config");

// node_modules/.pnpm/@smithy+shared-ini-file-loader@2.0.8/node_modules/@smithy/shared-ini-file-loader/dist-es/getCredentialsFilepath.js
var import_path5 = require("path");
var ENV_CREDENTIALS_PATH = "AWS_SHARED_CREDENTIALS_FILE";
var getCredentialsFilepath = () => process.env[ENV_CREDENTIALS_PATH] || (0, import_path5.join)(getHomeDir(), ".aws", "credentials");

// node_modules/.pnpm/@smithy+shared-ini-file-loader@2.0.8/node_modules/@smithy/shared-ini-file-loader/dist-es/getProfileData.js
var profileKeyRegex = /^profile\s(["'])?([^\1]+)\1$/;
var getProfileData = (data) => Object.entries(data).filter(([key]) => profileKeyRegex.test(key)).reduce((acc, [key, value]) => ({ ...acc, [profileKeyRegex.exec(key)[2]]: value }), {
  ...data.default && { default: data.default }
});

// node_modules/.pnpm/@smithy+shared-ini-file-loader@2.0.8/node_modules/@smithy/shared-ini-file-loader/dist-es/parseIni.js
var profileNameBlockList = ["__proto__", "profile __proto__"];
var parseIni = (iniData) => {
  const map2 = {};
  let currentSection;
  for (let line of iniData.split(/\r?\n/)) {
    line = line.split(/(^|\s)[;#]/)[0].trim();
    const isSection = line[0] === "[" && line[line.length - 1] === "]";
    if (isSection) {
      currentSection = line.substring(1, line.length - 1);
      if (profileNameBlockList.includes(currentSection)) {
        throw new Error(`Found invalid profile name "${currentSection}"`);
      }
    } else if (currentSection) {
      const indexOfEqualsSign = line.indexOf("=");
      const start = 0;
      const end = line.length - 1;
      const isAssignment = indexOfEqualsSign !== -1 && indexOfEqualsSign !== start && indexOfEqualsSign !== end;
      if (isAssignment) {
        const [name, value] = [
          line.substring(0, indexOfEqualsSign).trim(),
          line.substring(indexOfEqualsSign + 1).trim()
        ];
        map2[currentSection] = map2[currentSection] || {};
        map2[currentSection][name] = value;
      }
    }
  }
  return map2;
};

// node_modules/.pnpm/@smithy+shared-ini-file-loader@2.0.8/node_modules/@smithy/shared-ini-file-loader/dist-es/slurpFile.js
var import_fs2 = require("fs");
var { readFile: readFile2 } = import_fs2.promises;
var filePromisesHash = {};
var slurpFile = (path, options) => {
  if (!filePromisesHash[path] || (options == null ? void 0 : options.ignoreCache)) {
    filePromisesHash[path] = readFile2(path, "utf8");
  }
  return filePromisesHash[path];
};

// node_modules/.pnpm/@smithy+shared-ini-file-loader@2.0.8/node_modules/@smithy/shared-ini-file-loader/dist-es/loadSharedConfigFiles.js
var swallowError = () => ({});
var loadSharedConfigFiles = async (init = {}) => {
  const { filepath = getCredentialsFilepath(), configFilepath = getConfigFilepath() } = init;
  const parsedFiles = await Promise.all([
    slurpFile(configFilepath, {
      ignoreCache: init.ignoreCache
    }).then(parseIni).then(getProfileData).catch(swallowError),
    slurpFile(filepath, {
      ignoreCache: init.ignoreCache
    }).then(parseIni).catch(swallowError)
  ]);
  return {
    configFile: parsedFiles[0],
    credentialsFile: parsedFiles[1]
  };
};

// node_modules/.pnpm/@smithy+shared-ini-file-loader@2.0.8/node_modules/@smithy/shared-ini-file-loader/dist-es/getSsoSessionData.js
var ssoSessionKeyRegex = /^sso-session\s(["'])?([^\1]+)\1$/;
var getSsoSessionData = (data) => Object.entries(data).filter(([key]) => ssoSessionKeyRegex.test(key)).reduce((acc, [key, value]) => ({ ...acc, [ssoSessionKeyRegex.exec(key)[2]]: value }), {});

// node_modules/.pnpm/@smithy+shared-ini-file-loader@2.0.8/node_modules/@smithy/shared-ini-file-loader/dist-es/loadSsoSessionData.js
var swallowError2 = () => ({});
var loadSsoSessionData = async (init = {}) => {
  var _a;
  return slurpFile((_a = init.configFilepath) != null ? _a : getConfigFilepath()).then(parseIni).then(getSsoSessionData).catch(swallowError2);
};

// node_modules/.pnpm/@smithy+shared-ini-file-loader@2.0.8/node_modules/@smithy/shared-ini-file-loader/dist-es/mergeConfigFiles.js
var mergeConfigFiles = (...files) => {
  const merged = {};
  for (const file of files) {
    for (const [key, values] of Object.entries(file)) {
      if (merged[key] !== void 0) {
        Object.assign(merged[key], values);
      } else {
        merged[key] = values;
      }
    }
  }
  return merged;
};

// node_modules/.pnpm/@smithy+shared-ini-file-loader@2.0.8/node_modules/@smithy/shared-ini-file-loader/dist-es/parseKnownFiles.js
var parseKnownFiles = async (init) => {
  const parsedFiles = await loadSharedConfigFiles(init);
  return mergeConfigFiles(parsedFiles.configFile, parsedFiles.credentialsFile);
};

// node_modules/.pnpm/@smithy+credential-provider-imds@2.0.9/node_modules/@smithy/credential-provider-imds/dist-es/fromContainerMetadata.js
var import_url = require("url");

// node_modules/.pnpm/@smithy+credential-provider-imds@2.0.9/node_modules/@smithy/credential-provider-imds/dist-es/remoteProvider/httpRequest.js
var import_buffer2 = require("buffer");
var import_http2 = require("http");
function httpRequest(options) {
  return new Promise((resolve2, reject) => {
    var _a;
    const req = (0, import_http2.request)({
      method: "GET",
      ...options,
      hostname: (_a = options.hostname) == null ? void 0 : _a.replace(/^\[(.+)\]$/, "$1")
    });
    req.on("error", (err) => {
      reject(Object.assign(new ProviderError("Unable to connect to instance metadata service"), err));
      req.destroy();
    });
    req.on("timeout", () => {
      reject(new ProviderError("TimeoutError from instance metadata service"));
      req.destroy();
    });
    req.on("response", (res) => {
      const { statusCode = 400 } = res;
      if (statusCode < 200 || 300 <= statusCode) {
        reject(Object.assign(new ProviderError("Error response received from instance metadata service"), { statusCode }));
        req.destroy();
      }
      const chunks = [];
      res.on("data", (chunk) => {
        chunks.push(chunk);
      });
      res.on("end", () => {
        resolve2(import_buffer2.Buffer.concat(chunks));
        req.destroy();
      });
    });
    req.end();
  });
}

// node_modules/.pnpm/@smithy+credential-provider-imds@2.0.9/node_modules/@smithy/credential-provider-imds/dist-es/remoteProvider/ImdsCredentials.js
var isImdsCredentials = (arg) => Boolean(arg) && typeof arg === "object" && typeof arg.AccessKeyId === "string" && typeof arg.SecretAccessKey === "string" && typeof arg.Token === "string" && typeof arg.Expiration === "string";
var fromImdsCredentials = (creds) => ({
  accessKeyId: creds.AccessKeyId,
  secretAccessKey: creds.SecretAccessKey,
  sessionToken: creds.Token,
  expiration: new Date(creds.Expiration)
});

// node_modules/.pnpm/@smithy+credential-provider-imds@2.0.9/node_modules/@smithy/credential-provider-imds/dist-es/remoteProvider/RemoteProviderInit.js
var DEFAULT_TIMEOUT = 1e3;
var DEFAULT_MAX_RETRIES = 0;
var providerConfigFromInit = ({ maxRetries = DEFAULT_MAX_RETRIES, timeout = DEFAULT_TIMEOUT }) => ({ maxRetries, timeout });

// node_modules/.pnpm/@smithy+credential-provider-imds@2.0.9/node_modules/@smithy/credential-provider-imds/dist-es/remoteProvider/retry.js
var retry = (toRetry, maxRetries) => {
  let promise = toRetry();
  for (let i5 = 0; i5 < maxRetries; i5++) {
    promise = promise.catch(toRetry);
  }
  return promise;
};

// node_modules/.pnpm/@smithy+credential-provider-imds@2.0.9/node_modules/@smithy/credential-provider-imds/dist-es/fromContainerMetadata.js
var ENV_CMDS_FULL_URI = "AWS_CONTAINER_CREDENTIALS_FULL_URI";
var ENV_CMDS_RELATIVE_URI = "AWS_CONTAINER_CREDENTIALS_RELATIVE_URI";
var ENV_CMDS_AUTH_TOKEN = "AWS_CONTAINER_AUTHORIZATION_TOKEN";
var fromContainerMetadata = (init = {}) => {
  const { timeout, maxRetries } = providerConfigFromInit(init);
  return () => retry(async () => {
    const requestOptions = await getCmdsUri();
    const credsResponse = JSON.parse(await requestFromEcsImds(timeout, requestOptions));
    if (!isImdsCredentials(credsResponse)) {
      throw new CredentialsProviderError("Invalid response received from instance metadata service.");
    }
    return fromImdsCredentials(credsResponse);
  }, maxRetries);
};
var requestFromEcsImds = async (timeout, options) => {
  if (process.env[ENV_CMDS_AUTH_TOKEN]) {
    options.headers = {
      ...options.headers,
      Authorization: process.env[ENV_CMDS_AUTH_TOKEN]
    };
  }
  const buffer = await httpRequest({
    ...options,
    timeout
  });
  return buffer.toString();
};
var CMDS_IP = "169.254.170.2";
var GREENGRASS_HOSTS = {
  localhost: true,
  "127.0.0.1": true
};
var GREENGRASS_PROTOCOLS = {
  "http:": true,
  "https:": true
};
var getCmdsUri = async () => {
  if (process.env[ENV_CMDS_RELATIVE_URI]) {
    return {
      hostname: CMDS_IP,
      path: process.env[ENV_CMDS_RELATIVE_URI]
    };
  }
  if (process.env[ENV_CMDS_FULL_URI]) {
    const parsed = (0, import_url.parse)(process.env[ENV_CMDS_FULL_URI]);
    if (!parsed.hostname || !(parsed.hostname in GREENGRASS_HOSTS)) {
      throw new CredentialsProviderError(`${parsed.hostname} is not a valid container metadata service hostname`, false);
    }
    if (!parsed.protocol || !(parsed.protocol in GREENGRASS_PROTOCOLS)) {
      throw new CredentialsProviderError(`${parsed.protocol} is not a valid container metadata service protocol`, false);
    }
    return {
      ...parsed,
      port: parsed.port ? parseInt(parsed.port, 10) : void 0
    };
  }
  throw new CredentialsProviderError(`The container metadata credential provider cannot be used unless the ${ENV_CMDS_RELATIVE_URI} or ${ENV_CMDS_FULL_URI} environment variable is set`, false);
};

// node_modules/.pnpm/@smithy+node-config-provider@2.0.9/node_modules/@smithy/node-config-provider/dist-es/fromEnv.js
var fromEnv2 = (envVarSelector) => async () => {
  try {
    const config = envVarSelector(process.env);
    if (config === void 0) {
      throw new Error();
    }
    return config;
  } catch (e5) {
    throw new CredentialsProviderError(e5.message || `Cannot load config from environment variables with getter: ${envVarSelector}`);
  }
};

// node_modules/.pnpm/@smithy+node-config-provider@2.0.9/node_modules/@smithy/node-config-provider/dist-es/fromSharedConfigFiles.js
var fromSharedConfigFiles = (configSelector, { preferredFile = "config", ...init } = {}) => async () => {
  const profile = getProfileName(init);
  const { configFile, credentialsFile } = await loadSharedConfigFiles(init);
  const profileFromCredentials = credentialsFile[profile] || {};
  const profileFromConfig = configFile[profile] || {};
  const mergedProfile = preferredFile === "config" ? { ...profileFromCredentials, ...profileFromConfig } : { ...profileFromConfig, ...profileFromCredentials };
  try {
    const configValue = configSelector(mergedProfile);
    if (configValue === void 0) {
      throw new Error();
    }
    return configValue;
  } catch (e5) {
    throw new CredentialsProviderError(e5.message || `Cannot load config for profile ${profile} in SDK configuration files with getter: ${configSelector}`);
  }
};

// node_modules/.pnpm/@smithy+node-config-provider@2.0.9/node_modules/@smithy/node-config-provider/dist-es/fromStatic.js
var isFunction = (func) => typeof func === "function";
var fromStatic2 = (defaultValue) => isFunction(defaultValue) ? async () => await defaultValue() : fromStatic(defaultValue);

// node_modules/.pnpm/@smithy+node-config-provider@2.0.9/node_modules/@smithy/node-config-provider/dist-es/configLoader.js
var loadConfig = ({ environmentVariableSelector, configFileSelector, default: defaultValue }, configuration = {}) => memoize(chain(fromEnv2(environmentVariableSelector), fromSharedConfigFiles(configFileSelector, configuration), fromStatic2(defaultValue)));

// node_modules/.pnpm/@smithy+credential-provider-imds@2.0.9/node_modules/@smithy/credential-provider-imds/dist-es/config/Endpoint.js
var Endpoint;
(function(Endpoint2) {
  Endpoint2["IPv4"] = "http://169.254.169.254";
  Endpoint2["IPv6"] = "http://[fd00:ec2::254]";
})(Endpoint || (Endpoint = {}));

// node_modules/.pnpm/@smithy+credential-provider-imds@2.0.9/node_modules/@smithy/credential-provider-imds/dist-es/config/EndpointConfigOptions.js
var ENV_ENDPOINT_NAME = "AWS_EC2_METADATA_SERVICE_ENDPOINT";
var CONFIG_ENDPOINT_NAME = "ec2_metadata_service_endpoint";
var ENDPOINT_CONFIG_OPTIONS = {
  environmentVariableSelector: (env2) => env2[ENV_ENDPOINT_NAME],
  configFileSelector: (profile) => profile[CONFIG_ENDPOINT_NAME],
  default: void 0
};

// node_modules/.pnpm/@smithy+credential-provider-imds@2.0.9/node_modules/@smithy/credential-provider-imds/dist-es/config/EndpointMode.js
var EndpointMode;
(function(EndpointMode2) {
  EndpointMode2["IPv4"] = "IPv4";
  EndpointMode2["IPv6"] = "IPv6";
})(EndpointMode || (EndpointMode = {}));

// node_modules/.pnpm/@smithy+credential-provider-imds@2.0.9/node_modules/@smithy/credential-provider-imds/dist-es/config/EndpointModeConfigOptions.js
var ENV_ENDPOINT_MODE_NAME = "AWS_EC2_METADATA_SERVICE_ENDPOINT_MODE";
var CONFIG_ENDPOINT_MODE_NAME = "ec2_metadata_service_endpoint_mode";
var ENDPOINT_MODE_CONFIG_OPTIONS = {
  environmentVariableSelector: (env2) => env2[ENV_ENDPOINT_MODE_NAME],
  configFileSelector: (profile) => profile[CONFIG_ENDPOINT_MODE_NAME],
  default: EndpointMode.IPv4
};

// node_modules/.pnpm/@smithy+credential-provider-imds@2.0.9/node_modules/@smithy/credential-provider-imds/dist-es/utils/getInstanceMetadataEndpoint.js
var getInstanceMetadataEndpoint = async () => parseUrl(await getFromEndpointConfig() || await getFromEndpointModeConfig());
var getFromEndpointConfig = async () => loadConfig(ENDPOINT_CONFIG_OPTIONS)();
var getFromEndpointModeConfig = async () => {
  const endpointMode = await loadConfig(ENDPOINT_MODE_CONFIG_OPTIONS)();
  switch (endpointMode) {
    case EndpointMode.IPv4:
      return Endpoint.IPv4;
    case EndpointMode.IPv6:
      return Endpoint.IPv6;
    default:
      throw new Error(`Unsupported endpoint mode: ${endpointMode}. Select from ${Object.values(EndpointMode)}`);
  }
};

// node_modules/.pnpm/@smithy+credential-provider-imds@2.0.9/node_modules/@smithy/credential-provider-imds/dist-es/utils/getExtendedInstanceMetadataCredentials.js
var STATIC_STABILITY_REFRESH_INTERVAL_SECONDS = 5 * 60;
var STATIC_STABILITY_REFRESH_INTERVAL_JITTER_WINDOW_SECONDS = 5 * 60;
var STATIC_STABILITY_DOC_URL = "https://docs.aws.amazon.com/sdkref/latest/guide/feature-static-credentials.html";
var getExtendedInstanceMetadataCredentials = (credentials, logger2) => {
  var _a;
  const refreshInterval = STATIC_STABILITY_REFRESH_INTERVAL_SECONDS + Math.floor(Math.random() * STATIC_STABILITY_REFRESH_INTERVAL_JITTER_WINDOW_SECONDS);
  const newExpiration = new Date(Date.now() + refreshInterval * 1e3);
  logger2.warn("Attempting credential expiration extension due to a credential service availability issue. A refresh of these credentials will be attempted after ${new Date(newExpiration)}.\nFor more information, please visit: " + STATIC_STABILITY_DOC_URL);
  const originalExpiration = (_a = credentials.originalExpiration) != null ? _a : credentials.expiration;
  return {
    ...credentials,
    ...originalExpiration ? { originalExpiration } : {},
    expiration: newExpiration
  };
};

// node_modules/.pnpm/@smithy+credential-provider-imds@2.0.9/node_modules/@smithy/credential-provider-imds/dist-es/utils/staticStabilityProvider.js
var staticStabilityProvider = (provider, options = {}) => {
  const logger2 = (options == null ? void 0 : options.logger) || console;
  let pastCredentials;
  return async () => {
    let credentials;
    try {
      credentials = await provider();
      if (credentials.expiration && credentials.expiration.getTime() < Date.now()) {
        credentials = getExtendedInstanceMetadataCredentials(credentials, logger2);
      }
    } catch (e5) {
      if (pastCredentials) {
        logger2.warn("Credential renew failed: ", e5);
        credentials = getExtendedInstanceMetadataCredentials(pastCredentials, logger2);
      } else {
        throw e5;
      }
    }
    pastCredentials = credentials;
    return credentials;
  };
};

// node_modules/.pnpm/@smithy+credential-provider-imds@2.0.9/node_modules/@smithy/credential-provider-imds/dist-es/fromInstanceMetadata.js
var IMDS_PATH = "/latest/meta-data/iam/security-credentials/";
var IMDS_TOKEN_PATH = "/latest/api/token";
var fromInstanceMetadata = (init = {}) => staticStabilityProvider(getInstanceImdsProvider(init), { logger: init.logger });
var getInstanceImdsProvider = (init) => {
  let disableFetchToken = false;
  const { timeout, maxRetries } = providerConfigFromInit(init);
  const getCredentials = async (maxRetries2, options) => {
    const profile = (await retry(async () => {
      let profile2;
      try {
        profile2 = await getProfile(options);
      } catch (err) {
        if (err.statusCode === 401) {
          disableFetchToken = false;
        }
        throw err;
      }
      return profile2;
    }, maxRetries2)).trim();
    return retry(async () => {
      let creds;
      try {
        creds = await getCredentialsFromProfile(profile, options);
      } catch (err) {
        if (err.statusCode === 401) {
          disableFetchToken = false;
        }
        throw err;
      }
      return creds;
    }, maxRetries2);
  };
  return async () => {
    const endpoint = await getInstanceMetadataEndpoint();
    if (disableFetchToken) {
      return getCredentials(maxRetries, { ...endpoint, timeout });
    } else {
      let token;
      try {
        token = (await getMetadataToken({ ...endpoint, timeout })).toString();
      } catch (error) {
        if ((error == null ? void 0 : error.statusCode) === 400) {
          throw Object.assign(error, {
            message: "EC2 Metadata token request returned error"
          });
        } else if (error.message === "TimeoutError" || [403, 404, 405].includes(error.statusCode)) {
          disableFetchToken = true;
        }
        return getCredentials(maxRetries, { ...endpoint, timeout });
      }
      return getCredentials(maxRetries, {
        ...endpoint,
        headers: {
          "x-aws-ec2-metadata-token": token
        },
        timeout
      });
    }
  };
};
var getMetadataToken = async (options) => httpRequest({
  ...options,
  path: IMDS_TOKEN_PATH,
  method: "PUT",
  headers: {
    "x-aws-ec2-metadata-token-ttl-seconds": "21600"
  }
});
var getProfile = async (options) => (await httpRequest({ ...options, path: IMDS_PATH })).toString();
var getCredentialsFromProfile = async (profile, options) => {
  const credsResponse = JSON.parse((await httpRequest({
    ...options,
    path: IMDS_PATH + profile
  })).toString());
  if (!isImdsCredentials(credsResponse)) {
    throw new CredentialsProviderError("Invalid response received from instance metadata service.");
  }
  return fromImdsCredentials(credsResponse);
};

// node_modules/.pnpm/@aws-sdk+credential-provider-ini@3.409.0/node_modules/@aws-sdk/credential-provider-ini/dist-es/resolveCredentialSource.js
var resolveCredentialSource = (credentialSource, profileName) => {
  const sourceProvidersMap = {
    EcsContainer: fromContainerMetadata,
    Ec2InstanceMetadata: fromInstanceMetadata,
    Environment: fromEnv
  };
  if (credentialSource in sourceProvidersMap) {
    return sourceProvidersMap[credentialSource]();
  } else {
    throw new CredentialsProviderError(`Unsupported credential source in profile ${profileName}. Got ${credentialSource}, expected EcsContainer or Ec2InstanceMetadata or Environment.`);
  }
};

// node_modules/.pnpm/@aws-sdk+credential-provider-ini@3.409.0/node_modules/@aws-sdk/credential-provider-ini/dist-es/resolveAssumeRoleCredentials.js
var isAssumeRoleProfile = (arg) => Boolean(arg) && typeof arg === "object" && typeof arg.role_arn === "string" && ["undefined", "string"].indexOf(typeof arg.role_session_name) > -1 && ["undefined", "string"].indexOf(typeof arg.external_id) > -1 && ["undefined", "string"].indexOf(typeof arg.mfa_serial) > -1 && (isAssumeRoleWithSourceProfile(arg) || isAssumeRoleWithProviderProfile(arg));
var isAssumeRoleWithSourceProfile = (arg) => typeof arg.source_profile === "string" && typeof arg.credential_source === "undefined";
var isAssumeRoleWithProviderProfile = (arg) => typeof arg.credential_source === "string" && typeof arg.source_profile === "undefined";
var resolveAssumeRoleCredentials = async (profileName, profiles, options, visitedProfiles = {}) => {
  const data = profiles[profileName];
  if (!options.roleAssumer) {
    throw new CredentialsProviderError(`Profile ${profileName} requires a role to be assumed, but no role assumption callback was provided.`, false);
  }
  const { source_profile } = data;
  if (source_profile && source_profile in visitedProfiles) {
    throw new CredentialsProviderError(`Detected a cycle attempting to resolve credentials for profile ${getProfileName(options)}. Profiles visited: ` + Object.keys(visitedProfiles).join(", "), false);
  }
  const sourceCredsProvider = source_profile ? resolveProfileData(source_profile, profiles, options, {
    ...visitedProfiles,
    [source_profile]: true
  }) : resolveCredentialSource(data.credential_source, profileName)();
  const params = {
    RoleArn: data.role_arn,
    RoleSessionName: data.role_session_name || `aws-sdk-js-${Date.now()}`,
    ExternalId: data.external_id
  };
  const { mfa_serial } = data;
  if (mfa_serial) {
    if (!options.mfaCodeProvider) {
      throw new CredentialsProviderError(`Profile ${profileName} requires multi-factor authentication, but no MFA code callback was provided.`, false);
    }
    params.SerialNumber = mfa_serial;
    params.TokenCode = await options.mfaCodeProvider(mfa_serial);
  }
  const sourceCreds = await sourceCredsProvider;
  return options.roleAssumer(sourceCreds, params);
};

// node_modules/.pnpm/@aws-sdk+credential-provider-process@3.408.0/node_modules/@aws-sdk/credential-provider-process/dist-es/resolveProcessCredentials.js
var import_child_process = require("child_process");
var import_util4 = require("util");

// node_modules/.pnpm/@aws-sdk+credential-provider-process@3.408.0/node_modules/@aws-sdk/credential-provider-process/dist-es/getValidatedProcessCredentials.js
var getValidatedProcessCredentials = (profileName, data) => {
  if (data.Version !== 1) {
    throw Error(`Profile ${profileName} credential_process did not return Version 1.`);
  }
  if (data.AccessKeyId === void 0 || data.SecretAccessKey === void 0) {
    throw Error(`Profile ${profileName} credential_process returned invalid credentials.`);
  }
  if (data.Expiration) {
    const currentTime = /* @__PURE__ */ new Date();
    const expireTime = new Date(data.Expiration);
    if (expireTime < currentTime) {
      throw Error(`Profile ${profileName} credential_process returned expired credentials.`);
    }
  }
  return {
    accessKeyId: data.AccessKeyId,
    secretAccessKey: data.SecretAccessKey,
    ...data.SessionToken && { sessionToken: data.SessionToken },
    ...data.Expiration && { expiration: new Date(data.Expiration) }
  };
};

// node_modules/.pnpm/@aws-sdk+credential-provider-process@3.408.0/node_modules/@aws-sdk/credential-provider-process/dist-es/resolveProcessCredentials.js
var resolveProcessCredentials = async (profileName, profiles) => {
  const profile = profiles[profileName];
  if (profiles[profileName]) {
    const credentialProcess = profile["credential_process"];
    if (credentialProcess !== void 0) {
      const execPromise = (0, import_util4.promisify)(import_child_process.exec);
      try {
        const { stdout } = await execPromise(credentialProcess);
        let data;
        try {
          data = JSON.parse(stdout.trim());
        } catch {
          throw Error(`Profile ${profileName} credential_process returned invalid JSON.`);
        }
        return getValidatedProcessCredentials(profileName, data);
      } catch (error) {
        throw new CredentialsProviderError(error.message);
      }
    } else {
      throw new CredentialsProviderError(`Profile ${profileName} did not contain credential_process.`);
    }
  } else {
    throw new CredentialsProviderError(`Profile ${profileName} could not be found in shared credentials file.`);
  }
};

// node_modules/.pnpm/@aws-sdk+credential-provider-process@3.408.0/node_modules/@aws-sdk/credential-provider-process/dist-es/fromProcess.js
var fromProcess = (init = {}) => async () => {
  const profiles = await parseKnownFiles(init);
  return resolveProcessCredentials(getProfileName(init), profiles);
};

// node_modules/.pnpm/@aws-sdk+credential-provider-ini@3.409.0/node_modules/@aws-sdk/credential-provider-ini/dist-es/resolveProcessCredentials.js
var isProcessProfile = (arg) => Boolean(arg) && typeof arg === "object" && typeof arg.credential_process === "string";
var resolveProcessCredentials2 = async (options, profile) => fromProcess({
  ...options,
  profile
})();

// node_modules/.pnpm/@aws-sdk+credential-provider-sso@3.409.0/node_modules/@aws-sdk/credential-provider-sso/dist-es/isSsoProfile.js
var isSsoProfile = (arg) => arg && (typeof arg.sso_start_url === "string" || typeof arg.sso_account_id === "string" || typeof arg.sso_session === "string" || typeof arg.sso_region === "string" || typeof arg.sso_role_name === "string");

// node_modules/.pnpm/@aws-sdk+client-sso@3.409.0/node_modules/@aws-sdk/client-sso/dist-es/endpoint/EndpointParameters.js
var resolveClientEndpointParameters3 = (options) => {
  var _a, _b;
  return {
    ...options,
    useDualstackEndpoint: (_a = options.useDualstackEndpoint) != null ? _a : false,
    useFipsEndpoint: (_b = options.useFipsEndpoint) != null ? _b : false,
    defaultSigningName: "awsssoportal"
  };
};

// node_modules/.pnpm/@aws-sdk+client-sso@3.409.0/node_modules/@aws-sdk/client-sso/package.json
var package_default3 = {
  name: "@aws-sdk/client-sso",
  description: "AWS SDK for JavaScript Sso Client for Node.js, Browser and React Native",
  version: "3.409.0",
  scripts: {
    build: "concurrently 'yarn:build:cjs' 'yarn:build:es' 'yarn:build:types'",
    "build:cjs": "tsc -p tsconfig.cjs.json",
    "build:docs": "typedoc",
    "build:es": "tsc -p tsconfig.es.json",
    "build:include:deps": "lerna run --scope $npm_package_name --include-dependencies build",
    "build:types": "tsc -p tsconfig.types.json",
    "build:types:downlevel": "downlevel-dts dist-types dist-types/ts3.4",
    clean: "rimraf ./dist-* && rimraf *.tsbuildinfo",
    "extract:docs": "api-extractor run --local",
    "generate:client": "node ../../scripts/generate-clients/single-service --solo sso"
  },
  main: "./dist-cjs/index.js",
  types: "./dist-types/index.d.ts",
  module: "./dist-es/index.js",
  sideEffects: false,
  dependencies: {
    "@aws-crypto/sha256-browser": "3.0.0",
    "@aws-crypto/sha256-js": "3.0.0",
    "@aws-sdk/middleware-host-header": "3.408.0",
    "@aws-sdk/middleware-logger": "3.408.0",
    "@aws-sdk/middleware-recursion-detection": "3.408.0",
    "@aws-sdk/middleware-user-agent": "3.408.0",
    "@aws-sdk/types": "3.408.0",
    "@aws-sdk/util-endpoints": "3.408.0",
    "@aws-sdk/util-user-agent-browser": "3.408.0",
    "@aws-sdk/util-user-agent-node": "3.408.0",
    "@smithy/config-resolver": "^2.0.5",
    "@smithy/fetch-http-handler": "^2.0.5",
    "@smithy/hash-node": "^2.0.5",
    "@smithy/invalid-dependency": "^2.0.5",
    "@smithy/middleware-content-length": "^2.0.5",
    "@smithy/middleware-endpoint": "^2.0.5",
    "@smithy/middleware-retry": "^2.0.5",
    "@smithy/middleware-serde": "^2.0.5",
    "@smithy/middleware-stack": "^2.0.0",
    "@smithy/node-config-provider": "^2.0.6",
    "@smithy/node-http-handler": "^2.0.5",
    "@smithy/protocol-http": "^2.0.5",
    "@smithy/smithy-client": "^2.0.5",
    "@smithy/types": "^2.2.2",
    "@smithy/url-parser": "^2.0.5",
    "@smithy/util-base64": "^2.0.0",
    "@smithy/util-body-length-browser": "^2.0.0",
    "@smithy/util-body-length-node": "^2.1.0",
    "@smithy/util-defaults-mode-browser": "^2.0.6",
    "@smithy/util-defaults-mode-node": "^2.0.6",
    "@smithy/util-retry": "^2.0.0",
    "@smithy/util-utf8": "^2.0.0",
    tslib: "^2.5.0"
  },
  devDependencies: {
    "@smithy/service-client-documentation-generator": "^2.0.0",
    "@tsconfig/node14": "1.0.3",
    "@types/node": "^14.14.31",
    concurrently: "7.0.0",
    "downlevel-dts": "0.10.1",
    rimraf: "3.0.2",
    typedoc: "0.23.23",
    typescript: "~4.9.5"
  },
  engines: {
    node: ">=14.0.0"
  },
  typesVersions: {
    "<4.0": {
      "dist-types/*": [
        "dist-types/ts3.4/*"
      ]
    }
  },
  files: [
    "dist-*/**"
  ],
  author: {
    name: "AWS SDK for JavaScript Team",
    url: "https://aws.amazon.com/javascript/"
  },
  license: "Apache-2.0",
  browser: {
    "./dist-es/runtimeConfig": "./dist-es/runtimeConfig.browser"
  },
  "react-native": {
    "./dist-es/runtimeConfig": "./dist-es/runtimeConfig.native"
  },
  homepage: "https://github.com/aws/aws-sdk-js-v3/tree/main/clients/client-sso",
  repository: {
    type: "git",
    url: "https://github.com/aws/aws-sdk-js-v3.git",
    directory: "clients/client-sso"
  }
};

// node_modules/.pnpm/@aws-sdk+util-user-agent-node@3.408.0/node_modules/@aws-sdk/util-user-agent-node/dist-es/index.js
var import_os3 = require("os");
var import_process = require("process");

// node_modules/.pnpm/@aws-sdk+util-user-agent-node@3.408.0/node_modules/@aws-sdk/util-user-agent-node/dist-es/is-crt-available.js
var isCrtAvailable = () => {
  try {
    if (typeof require === "function" && typeof module !== "undefined" && require("aws-crt")) {
      return ["md/crt-avail"];
    }
    return null;
  } catch (e5) {
    return null;
  }
};

// node_modules/.pnpm/@aws-sdk+util-user-agent-node@3.408.0/node_modules/@aws-sdk/util-user-agent-node/dist-es/index.js
var UA_APP_ID_ENV_NAME = "AWS_SDK_UA_APP_ID";
var UA_APP_ID_INI_NAME = "sdk-ua-app-id";
var defaultUserAgent = ({ serviceId, clientVersion }) => {
  const sections = [
    ["aws-sdk-js", clientVersion],
    ["ua", "2.0"],
    [`os/${(0, import_os3.platform)()}`, (0, import_os3.release)()],
    ["lang/js"],
    ["md/nodejs", `${import_process.versions.node}`]
  ];
  const crtAvailable = isCrtAvailable();
  if (crtAvailable) {
    sections.push(crtAvailable);
  }
  if (serviceId) {
    sections.push([`api/${serviceId}`, clientVersion]);
  }
  if (import_process.env.AWS_EXECUTION_ENV) {
    sections.push([`exec-env/${import_process.env.AWS_EXECUTION_ENV}`]);
  }
  const appIdPromise = loadConfig({
    environmentVariableSelector: (env2) => env2[UA_APP_ID_ENV_NAME],
    configFileSelector: (profile) => profile[UA_APP_ID_INI_NAME],
    default: void 0
  })();
  let resolvedUserAgent = void 0;
  return async () => {
    if (!resolvedUserAgent) {
      const appId = await appIdPromise;
      resolvedUserAgent = appId ? [...sections, [`app/${appId}`]] : [...sections];
    }
    return resolvedUserAgent;
  };
};

// node_modules/.pnpm/@smithy+hash-node@2.0.6/node_modules/@smithy/hash-node/dist-es/index.js
var import_buffer3 = require("buffer");
var import_crypto3 = require("crypto");
var Hash = class {
  constructor(algorithmIdentifier, secret) {
    this.algorithmIdentifier = algorithmIdentifier;
    this.secret = secret;
    this.reset();
  }
  update(toHash, encoding) {
    this.hash.update(toUint8Array(castSourceData(toHash, encoding)));
  }
  digest() {
    return Promise.resolve(this.hash.digest());
  }
  reset() {
    this.hash = this.secret ? (0, import_crypto3.createHmac)(this.algorithmIdentifier, castSourceData(this.secret)) : (0, import_crypto3.createHash)(this.algorithmIdentifier);
  }
};
function castSourceData(toCast, encoding) {
  if (import_buffer3.Buffer.isBuffer(toCast)) {
    return toCast;
  }
  if (typeof toCast === "string") {
    return fromString(toCast, encoding);
  }
  if (ArrayBuffer.isView(toCast)) {
    return fromArrayBuffer(toCast.buffer, toCast.byteOffset, toCast.byteLength);
  }
  return fromArrayBuffer(toCast);
}

// node_modules/.pnpm/@smithy+util-body-length-node@2.1.0/node_modules/@smithy/util-body-length-node/dist-es/calculateBodyLength.js
var import_fs3 = require("fs");
var calculateBodyLength = (body) => {
  if (!body) {
    return 0;
  }
  if (typeof body === "string") {
    return Buffer.from(body).length;
  } else if (typeof body.byteLength === "number") {
    return body.byteLength;
  } else if (typeof body.size === "number") {
    return body.size;
  } else if (typeof body.start === "number" && typeof body.end === "number") {
    return body.end + 1 - body.start;
  } else if (typeof body.path === "string" || Buffer.isBuffer(body.path)) {
    return (0, import_fs3.lstatSync)(body.path).size;
  } else if (typeof body.fd === "number") {
    return (0, import_fs3.fstatSync)(body.fd).size;
  }
  throw new Error(`Body Length computation failed for ${body}`);
};

// node_modules/.pnpm/@aws-sdk+client-sso@3.409.0/node_modules/@aws-sdk/client-sso/dist-es/endpoint/ruleset.js
var q = "required";
var r = "fn";
var s = "argv";
var t = "ref";
var a = "isSet";
var b = "tree";
var c = "error";
var d = "endpoint";
var e = "PartitionResult";
var f = { [q]: false, "type": "String" };
var g = { [q]: true, "default": false, "type": "Boolean" };
var h = { [t]: "Endpoint" };
var i = { [r]: "booleanEquals", [s]: [{ [t]: "UseFIPS" }, true] };
var j = { [r]: "booleanEquals", [s]: [{ [t]: "UseDualStack" }, true] };
var k = {};
var l = { [r]: "booleanEquals", [s]: [true, { [r]: "getAttr", [s]: [{ [t]: e }, "supportsFIPS"] }] };
var m = { [r]: "booleanEquals", [s]: [true, { [r]: "getAttr", [s]: [{ [t]: e }, "supportsDualStack"] }] };
var n = [i];
var o = [j];
var p = [{ [t]: "Region" }];
var _data = { version: "1.0", parameters: { Region: f, UseDualStack: g, UseFIPS: g, Endpoint: f }, rules: [{ conditions: [{ [r]: a, [s]: [h] }], type: b, rules: [{ conditions: n, error: "Invalid Configuration: FIPS and custom endpoint are not supported", type: c }, { conditions: o, error: "Invalid Configuration: Dualstack and custom endpoint are not supported", type: c }, { endpoint: { url: h, properties: k, headers: k }, type: d }] }, { conditions: [{ [r]: a, [s]: p }], type: b, rules: [{ conditions: [{ [r]: "aws.partition", [s]: p, assign: e }], type: b, rules: [{ conditions: [i, j], type: b, rules: [{ conditions: [l, m], type: b, rules: [{ endpoint: { url: "https://portal.sso-fips.{Region}.{PartitionResult#dualStackDnsSuffix}", properties: k, headers: k }, type: d }] }, { error: "FIPS and DualStack are enabled, but this partition does not support one or both", type: c }] }, { conditions: n, type: b, rules: [{ conditions: [l], type: b, rules: [{ endpoint: { url: "https://portal.sso-fips.{Region}.{PartitionResult#dnsSuffix}", properties: k, headers: k }, type: d }] }, { error: "FIPS is enabled but this partition does not support FIPS", type: c }] }, { conditions: o, type: b, rules: [{ conditions: [m], type: b, rules: [{ endpoint: { url: "https://portal.sso.{Region}.{PartitionResult#dualStackDnsSuffix}", properties: k, headers: k }, type: d }] }, { error: "DualStack is enabled but this partition does not support DualStack", type: c }] }, { endpoint: { url: "https://portal.sso.{Region}.{PartitionResult#dnsSuffix}", properties: k, headers: k }, type: d }] }] }, { error: "Invalid Configuration: Missing Region", type: c }] };
var ruleSet = _data;

// node_modules/.pnpm/@aws-sdk+client-sso@3.409.0/node_modules/@aws-sdk/client-sso/dist-es/endpoint/endpointResolver.js
var defaultEndpointResolver = (endpointParams, context = {}) => {
  return resolveEndpoint(ruleSet, {
    endpointParams,
    logger: context.logger
  });
};

// node_modules/.pnpm/@aws-sdk+client-sso@3.409.0/node_modules/@aws-sdk/client-sso/dist-es/runtimeConfig.shared.js
var getRuntimeConfig = (config) => {
  var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j;
  return {
    apiVersion: "2019-06-10",
    base64Decoder: (_a = config == null ? void 0 : config.base64Decoder) != null ? _a : fromBase64,
    base64Encoder: (_b = config == null ? void 0 : config.base64Encoder) != null ? _b : toBase64,
    disableHostPrefix: (_c = config == null ? void 0 : config.disableHostPrefix) != null ? _c : false,
    endpointProvider: (_d = config == null ? void 0 : config.endpointProvider) != null ? _d : defaultEndpointResolver,
    extensions: (_e = config == null ? void 0 : config.extensions) != null ? _e : [],
    logger: (_f = config == null ? void 0 : config.logger) != null ? _f : new NoOpLogger(),
    serviceId: (_g = config == null ? void 0 : config.serviceId) != null ? _g : "SSO",
    urlParser: (_h = config == null ? void 0 : config.urlParser) != null ? _h : parseUrl,
    utf8Decoder: (_i = config == null ? void 0 : config.utf8Decoder) != null ? _i : fromUtf84,
    utf8Encoder: (_j = config == null ? void 0 : config.utf8Encoder) != null ? _j : toUtf84
  };
};

// node_modules/.pnpm/@smithy+util-defaults-mode-node@2.0.9/node_modules/@smithy/util-defaults-mode-node/dist-es/constants.js
var AWS_EXECUTION_ENV = "AWS_EXECUTION_ENV";
var AWS_REGION_ENV = "AWS_REGION";
var AWS_DEFAULT_REGION_ENV = "AWS_DEFAULT_REGION";
var ENV_IMDS_DISABLED = "AWS_EC2_METADATA_DISABLED";
var DEFAULTS_MODE_OPTIONS = ["in-region", "cross-region", "mobile", "standard", "legacy"];
var IMDS_REGION_PATH = "/latest/meta-data/placement/region";

// node_modules/.pnpm/@smithy+util-defaults-mode-node@2.0.9/node_modules/@smithy/util-defaults-mode-node/dist-es/defaultsModeConfig.js
var AWS_DEFAULTS_MODE_ENV = "AWS_DEFAULTS_MODE";
var AWS_DEFAULTS_MODE_CONFIG = "defaults_mode";
var NODE_DEFAULTS_MODE_CONFIG_OPTIONS = {
  environmentVariableSelector: (env2) => {
    return env2[AWS_DEFAULTS_MODE_ENV];
  },
  configFileSelector: (profile) => {
    return profile[AWS_DEFAULTS_MODE_CONFIG];
  },
  default: "legacy"
};

// node_modules/.pnpm/@smithy+util-defaults-mode-node@2.0.9/node_modules/@smithy/util-defaults-mode-node/dist-es/resolveDefaultsModeConfig.js
var resolveDefaultsModeConfig = ({ region = loadConfig(NODE_REGION_CONFIG_OPTIONS), defaultsMode = loadConfig(NODE_DEFAULTS_MODE_CONFIG_OPTIONS) } = {}) => memoize(async () => {
  const mode = typeof defaultsMode === "function" ? await defaultsMode() : defaultsMode;
  switch (mode == null ? void 0 : mode.toLowerCase()) {
    case "auto":
      return resolveNodeDefaultsModeAuto(region);
    case "in-region":
    case "cross-region":
    case "mobile":
    case "standard":
    case "legacy":
      return Promise.resolve(mode == null ? void 0 : mode.toLocaleLowerCase());
    case void 0:
      return Promise.resolve("legacy");
    default:
      throw new Error(`Invalid parameter for "defaultsMode", expect ${DEFAULTS_MODE_OPTIONS.join(", ")}, got ${mode}`);
  }
});
var resolveNodeDefaultsModeAuto = async (clientRegion) => {
  if (clientRegion) {
    const resolvedRegion = typeof clientRegion === "function" ? await clientRegion() : clientRegion;
    const inferredRegion = await inferPhysicalRegion();
    if (!inferredRegion) {
      return "standard";
    }
    if (resolvedRegion === inferredRegion) {
      return "in-region";
    } else {
      return "cross-region";
    }
  }
  return "standard";
};
var inferPhysicalRegion = async () => {
  var _a;
  if (process.env[AWS_EXECUTION_ENV] && (process.env[AWS_REGION_ENV] || process.env[AWS_DEFAULT_REGION_ENV])) {
    return (_a = process.env[AWS_REGION_ENV]) != null ? _a : process.env[AWS_DEFAULT_REGION_ENV];
  }
  if (!process.env[ENV_IMDS_DISABLED]) {
    try {
      const endpoint = await getInstanceMetadataEndpoint();
      return (await httpRequest({ ...endpoint, path: IMDS_REGION_PATH })).toString();
    } catch (e5) {
    }
  }
};

// node_modules/.pnpm/@aws-sdk+client-sso@3.409.0/node_modules/@aws-sdk/client-sso/dist-es/runtimeConfig.js
var getRuntimeConfig2 = (config) => {
  var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j;
  emitWarningIfUnsupportedVersion(process.version);
  const defaultsMode = resolveDefaultsModeConfig(config);
  const defaultConfigProvider = () => defaultsMode().then(loadConfigsForDefaultMode);
  const clientSharedValues = getRuntimeConfig(config);
  return {
    ...clientSharedValues,
    ...config,
    runtime: "node",
    defaultsMode,
    bodyLengthChecker: (_a = config == null ? void 0 : config.bodyLengthChecker) != null ? _a : calculateBodyLength,
    defaultUserAgentProvider: (_b = config == null ? void 0 : config.defaultUserAgentProvider) != null ? _b : defaultUserAgent({ serviceId: clientSharedValues.serviceId, clientVersion: package_default3.version }),
    maxAttempts: (_c = config == null ? void 0 : config.maxAttempts) != null ? _c : loadConfig(NODE_MAX_ATTEMPT_CONFIG_OPTIONS),
    region: (_d = config == null ? void 0 : config.region) != null ? _d : loadConfig(NODE_REGION_CONFIG_OPTIONS, NODE_REGION_CONFIG_FILE_OPTIONS),
    requestHandler: (_e = config == null ? void 0 : config.requestHandler) != null ? _e : new NodeHttpHandler(defaultConfigProvider),
    retryMode: (_f = config == null ? void 0 : config.retryMode) != null ? _f : loadConfig({
      ...NODE_RETRY_MODE_CONFIG_OPTIONS,
      default: async () => (await defaultConfigProvider()).retryMode || DEFAULT_RETRY_MODE
    }),
    sha256: (_g = config == null ? void 0 : config.sha256) != null ? _g : Hash.bind(null, "sha256"),
    streamCollector: (_h = config == null ? void 0 : config.streamCollector) != null ? _h : streamCollector,
    useDualstackEndpoint: (_i = config == null ? void 0 : config.useDualstackEndpoint) != null ? _i : loadConfig(NODE_USE_DUALSTACK_ENDPOINT_CONFIG_OPTIONS),
    useFipsEndpoint: (_j = config == null ? void 0 : config.useFipsEndpoint) != null ? _j : loadConfig(NODE_USE_FIPS_ENDPOINT_CONFIG_OPTIONS)
  };
};

// node_modules/.pnpm/@aws-sdk+client-sso@3.409.0/node_modules/@aws-sdk/client-sso/dist-es/runtimeExtensions.js
var asPartial = (t4) => t4;
var resolveRuntimeExtensions = (runtimeConfig, extensions) => {
  const extensionConfiguration = {
    ...asPartial(getDefaultExtensionConfiguration(runtimeConfig))
  };
  extensions.forEach((extension) => extension.configure(extensionConfiguration));
  return {
    ...runtimeConfig,
    ...resolveDefaultRuntimeConfig(extensionConfiguration)
  };
};

// node_modules/.pnpm/@aws-sdk+client-sso@3.409.0/node_modules/@aws-sdk/client-sso/dist-es/SSOClient.js
var SSOClient = class extends Client {
  constructor(...[configuration]) {
    const _config_0 = getRuntimeConfig2(configuration || {});
    const _config_1 = resolveClientEndpointParameters3(_config_0);
    const _config_2 = resolveRegionConfig(_config_1);
    const _config_3 = resolveEndpointConfig(_config_2);
    const _config_4 = resolveRetryConfig(_config_3);
    const _config_5 = resolveHostHeaderConfig(_config_4);
    const _config_6 = resolveUserAgentConfig(_config_5);
    const _config_7 = resolveRuntimeExtensions(_config_6, (configuration == null ? void 0 : configuration.extensions) || []);
    super(_config_7);
    this.config = _config_7;
    this.middlewareStack.use(getRetryPlugin(this.config));
    this.middlewareStack.use(getContentLengthPlugin(this.config));
    this.middlewareStack.use(getHostHeaderPlugin(this.config));
    this.middlewareStack.use(getLoggerPlugin(this.config));
    this.middlewareStack.use(getRecursionDetectionPlugin(this.config));
    this.middlewareStack.use(getUserAgentPlugin(this.config));
  }
  destroy() {
    super.destroy();
  }
};

// node_modules/.pnpm/@aws-sdk+client-sso@3.409.0/node_modules/@aws-sdk/client-sso/dist-es/models/SSOServiceException.js
var SSOServiceException = class _SSOServiceException extends ServiceException {
  constructor(options) {
    super(options);
    Object.setPrototypeOf(this, _SSOServiceException.prototype);
  }
};

// node_modules/.pnpm/@aws-sdk+client-sso@3.409.0/node_modules/@aws-sdk/client-sso/dist-es/models/models_0.js
var InvalidRequestException = class _InvalidRequestException2 extends SSOServiceException {
  constructor(opts) {
    super({
      name: "InvalidRequestException",
      $fault: "client",
      ...opts
    });
    this.name = "InvalidRequestException";
    this.$fault = "client";
    Object.setPrototypeOf(this, _InvalidRequestException2.prototype);
  }
};
var ResourceNotFoundException = class _ResourceNotFoundException extends SSOServiceException {
  constructor(opts) {
    super({
      name: "ResourceNotFoundException",
      $fault: "client",
      ...opts
    });
    this.name = "ResourceNotFoundException";
    this.$fault = "client";
    Object.setPrototypeOf(this, _ResourceNotFoundException.prototype);
  }
};
var TooManyRequestsException = class _TooManyRequestsException extends SSOServiceException {
  constructor(opts) {
    super({
      name: "TooManyRequestsException",
      $fault: "client",
      ...opts
    });
    this.name = "TooManyRequestsException";
    this.$fault = "client";
    Object.setPrototypeOf(this, _TooManyRequestsException.prototype);
  }
};
var UnauthorizedException = class _UnauthorizedException extends SSOServiceException {
  constructor(opts) {
    super({
      name: "UnauthorizedException",
      $fault: "client",
      ...opts
    });
    this.name = "UnauthorizedException";
    this.$fault = "client";
    Object.setPrototypeOf(this, _UnauthorizedException.prototype);
  }
};
var GetRoleCredentialsRequestFilterSensitiveLog = (obj) => ({
  ...obj,
  ...obj.accessToken && { accessToken: SENSITIVE_STRING }
});
var RoleCredentialsFilterSensitiveLog = (obj) => ({
  ...obj,
  ...obj.secretAccessKey && { secretAccessKey: SENSITIVE_STRING },
  ...obj.sessionToken && { sessionToken: SENSITIVE_STRING }
});
var GetRoleCredentialsResponseFilterSensitiveLog = (obj) => ({
  ...obj,
  ...obj.roleCredentials && { roleCredentials: RoleCredentialsFilterSensitiveLog(obj.roleCredentials) }
});

// node_modules/.pnpm/@aws-sdk+client-sso@3.409.0/node_modules/@aws-sdk/client-sso/dist-es/protocols/Aws_restJson1.js
var se_GetRoleCredentialsCommand = async (input, context) => {
  const { hostname, protocol = "https", port, path: basePath } = await context.endpoint();
  const headers = map({}, isSerializableHeaderValue, {
    "x-amz-sso_bearer_token": input.accessToken
  });
  const resolvedPath2 = `${(basePath == null ? void 0 : basePath.endsWith("/")) ? basePath.slice(0, -1) : basePath || ""}/federation/credentials`;
  const query = map({
    role_name: [, expectNonNull(input.roleName, `roleName`)],
    account_id: [, expectNonNull(input.accountId, `accountId`)]
  });
  let body;
  return new HttpRequest({
    protocol,
    hostname,
    port,
    method: "GET",
    headers,
    path: resolvedPath2,
    query,
    body
  });
};
var de_GetRoleCredentialsCommand = async (output, context) => {
  if (output.statusCode !== 200 && output.statusCode >= 300) {
    return de_GetRoleCredentialsCommandError(output, context);
  }
  const contents = map({
    $metadata: deserializeMetadata3(output)
  });
  const data = expectNonNull(expectObject(await parseBody2(output.body, context)), "body");
  const doc = take(data, {
    roleCredentials: _json
  });
  Object.assign(contents, doc);
  return contents;
};
var de_GetRoleCredentialsCommandError = async (output, context) => {
  const parsedOutput = {
    ...output,
    body: await parseErrorBody2(output.body, context)
  };
  const errorCode = loadRestJsonErrorCode(output, parsedOutput.body);
  switch (errorCode) {
    case "InvalidRequestException":
    case "com.amazonaws.sso#InvalidRequestException":
      throw await de_InvalidRequestExceptionRes(parsedOutput, context);
    case "ResourceNotFoundException":
    case "com.amazonaws.sso#ResourceNotFoundException":
      throw await de_ResourceNotFoundExceptionRes(parsedOutput, context);
    case "TooManyRequestsException":
    case "com.amazonaws.sso#TooManyRequestsException":
      throw await de_TooManyRequestsExceptionRes(parsedOutput, context);
    case "UnauthorizedException":
    case "com.amazonaws.sso#UnauthorizedException":
      throw await de_UnauthorizedExceptionRes(parsedOutput, context);
    default:
      const parsedBody = parsedOutput.body;
      return throwDefaultError3({
        output,
        parsedBody,
        errorCode
      });
  }
};
var throwDefaultError3 = withBaseException(SSOServiceException);
var de_InvalidRequestExceptionRes = async (parsedOutput, context) => {
  const contents = map({});
  const data = parsedOutput.body;
  const doc = take(data, {
    message: expectString
  });
  Object.assign(contents, doc);
  const exception = new InvalidRequestException({
    $metadata: deserializeMetadata3(parsedOutput),
    ...contents
  });
  return decorateServiceException(exception, parsedOutput.body);
};
var de_ResourceNotFoundExceptionRes = async (parsedOutput, context) => {
  const contents = map({});
  const data = parsedOutput.body;
  const doc = take(data, {
    message: expectString
  });
  Object.assign(contents, doc);
  const exception = new ResourceNotFoundException({
    $metadata: deserializeMetadata3(parsedOutput),
    ...contents
  });
  return decorateServiceException(exception, parsedOutput.body);
};
var de_TooManyRequestsExceptionRes = async (parsedOutput, context) => {
  const contents = map({});
  const data = parsedOutput.body;
  const doc = take(data, {
    message: expectString
  });
  Object.assign(contents, doc);
  const exception = new TooManyRequestsException({
    $metadata: deserializeMetadata3(parsedOutput),
    ...contents
  });
  return decorateServiceException(exception, parsedOutput.body);
};
var de_UnauthorizedExceptionRes = async (parsedOutput, context) => {
  const contents = map({});
  const data = parsedOutput.body;
  const doc = take(data, {
    message: expectString
  });
  Object.assign(contents, doc);
  const exception = new UnauthorizedException({
    $metadata: deserializeMetadata3(parsedOutput),
    ...contents
  });
  return decorateServiceException(exception, parsedOutput.body);
};
var deserializeMetadata3 = (output) => {
  var _a, _b;
  return {
    httpStatusCode: output.statusCode,
    requestId: (_b = (_a = output.headers["x-amzn-requestid"]) != null ? _a : output.headers["x-amzn-request-id"]) != null ? _b : output.headers["x-amz-request-id"],
    extendedRequestId: output.headers["x-amz-id-2"],
    cfId: output.headers["x-amz-cf-id"]
  };
};
var collectBodyString2 = (streamBody, context) => collectBody(streamBody, context).then((body) => context.utf8Encoder(body));
var isSerializableHeaderValue = (value) => value !== void 0 && value !== null && value !== "" && (!Object.getOwnPropertyNames(value).includes("length") || value.length != 0) && (!Object.getOwnPropertyNames(value).includes("size") || value.size != 0);
var parseBody2 = (streamBody, context) => collectBodyString2(streamBody, context).then((encoded) => {
  if (encoded.length) {
    return JSON.parse(encoded);
  }
  return {};
});
var parseErrorBody2 = async (errorBody, context) => {
  var _a;
  const value = await parseBody2(errorBody, context);
  value.message = (_a = value.message) != null ? _a : value.Message;
  return value;
};
var loadRestJsonErrorCode = (output, data) => {
  const findKey = (object, key) => Object.keys(object).find((k5) => k5.toLowerCase() === key.toLowerCase());
  const sanitizeErrorCode = (rawValue) => {
    let cleanValue = rawValue;
    if (typeof cleanValue === "number") {
      cleanValue = cleanValue.toString();
    }
    if (cleanValue.indexOf(",") >= 0) {
      cleanValue = cleanValue.split(",")[0];
    }
    if (cleanValue.indexOf(":") >= 0) {
      cleanValue = cleanValue.split(":")[0];
    }
    if (cleanValue.indexOf("#") >= 0) {
      cleanValue = cleanValue.split("#")[1];
    }
    return cleanValue;
  };
  const headerKey = findKey(output.headers, "x-amzn-errortype");
  if (headerKey !== void 0) {
    return sanitizeErrorCode(output.headers[headerKey]);
  }
  if (data.code !== void 0) {
    return sanitizeErrorCode(data.code);
  }
  if (data["__type"] !== void 0) {
    return sanitizeErrorCode(data["__type"]);
  }
};

// node_modules/.pnpm/@aws-sdk+client-sso@3.409.0/node_modules/@aws-sdk/client-sso/dist-es/commands/GetRoleCredentialsCommand.js
var GetRoleCredentialsCommand = class _GetRoleCredentialsCommand extends Command {
  static getEndpointParameterInstructions() {
    return {
      UseFIPS: { type: "builtInParams", name: "useFipsEndpoint" },
      Endpoint: { type: "builtInParams", name: "endpoint" },
      Region: { type: "builtInParams", name: "region" },
      UseDualStack: { type: "builtInParams", name: "useDualstackEndpoint" }
    };
  }
  constructor(input) {
    super();
    this.input = input;
  }
  resolveMiddleware(clientStack, configuration, options) {
    this.middlewareStack.use(getSerdePlugin(configuration, this.serialize, this.deserialize));
    this.middlewareStack.use(getEndpointPlugin(configuration, _GetRoleCredentialsCommand.getEndpointParameterInstructions()));
    const stack = clientStack.concat(this.middlewareStack);
    const { logger: logger2 } = configuration;
    const clientName = "SSOClient";
    const commandName = "GetRoleCredentialsCommand";
    const handlerExecutionContext = {
      logger: logger2,
      clientName,
      commandName,
      inputFilterSensitiveLog: GetRoleCredentialsRequestFilterSensitiveLog,
      outputFilterSensitiveLog: GetRoleCredentialsResponseFilterSensitiveLog
    };
    const { requestHandler } = configuration;
    return stack.resolve((request2) => requestHandler.handle(request2.request, options || {}), handlerExecutionContext);
  }
  serialize(input, context) {
    return se_GetRoleCredentialsCommand(input, context);
  }
  deserialize(output, context) {
    return de_GetRoleCredentialsCommand(output, context);
  }
};

// node_modules/.pnpm/@aws-sdk+token-providers@3.408.0/node_modules/@aws-sdk/token-providers/dist-es/bundle/client-sso-oidc-node.js
var resolveClientEndpointParameters4 = (options) => {
  var _a, _b;
  return {
    ...options,
    useDualstackEndpoint: (_a = options.useDualstackEndpoint) != null ? _a : false,
    useFipsEndpoint: (_b = options.useFipsEndpoint) != null ? _b : false,
    defaultSigningName: "awsssooidc"
  };
};
var package_default4 = { version: "3.387.0" };
var p2 = "required";
var q2 = "fn";
var r2 = "argv";
var s2 = "ref";
var a2 = "PartitionResult";
var b2 = "tree";
var c2 = "error";
var d2 = "endpoint";
var e2 = { [p2]: false, "type": "String" };
var f2 = { [p2]: true, "default": false, "type": "Boolean" };
var g2 = { [s2]: "Endpoint" };
var h2 = { [q2]: "booleanEquals", [r2]: [{ [s2]: "UseFIPS" }, true] };
var i2 = { [q2]: "booleanEquals", [r2]: [{ [s2]: "UseDualStack" }, true] };
var j2 = {};
var k2 = { [q2]: "booleanEquals", [r2]: [true, { [q2]: "getAttr", [r2]: [{ [s2]: a2 }, "supportsFIPS"] }] };
var l2 = { [q2]: "booleanEquals", [r2]: [true, { [q2]: "getAttr", [r2]: [{ [s2]: a2 }, "supportsDualStack"] }] };
var m2 = [g2];
var n2 = [h2];
var o2 = [i2];
var _data2 = { version: "1.0", parameters: { Region: e2, UseDualStack: f2, UseFIPS: f2, Endpoint: e2 }, rules: [{ conditions: [{ [q2]: "aws.partition", [r2]: [{ [s2]: "Region" }], assign: a2 }], type: b2, rules: [{ conditions: [{ [q2]: "isSet", [r2]: m2 }, { [q2]: "parseURL", [r2]: m2, assign: "url" }], type: b2, rules: [{ conditions: n2, error: "Invalid Configuration: FIPS and custom endpoint are not supported", type: c2 }, { type: b2, rules: [{ conditions: o2, error: "Invalid Configuration: Dualstack and custom endpoint are not supported", type: c2 }, { endpoint: { url: g2, properties: j2, headers: j2 }, type: d2 }] }] }, { conditions: [h2, i2], type: b2, rules: [{ conditions: [k2, l2], type: b2, rules: [{ endpoint: { url: "https://oidc-fips.{Region}.{PartitionResult#dualStackDnsSuffix}", properties: j2, headers: j2 }, type: d2 }] }, { error: "FIPS and DualStack are enabled, but this partition does not support one or both", type: c2 }] }, { conditions: n2, type: b2, rules: [{ conditions: [k2], type: b2, rules: [{ type: b2, rules: [{ endpoint: { url: "https://oidc-fips.{Region}.{PartitionResult#dnsSuffix}", properties: j2, headers: j2 }, type: d2 }] }] }, { error: "FIPS is enabled but this partition does not support FIPS", type: c2 }] }, { conditions: o2, type: b2, rules: [{ conditions: [l2], type: b2, rules: [{ endpoint: { url: "https://oidc.{Region}.{PartitionResult#dualStackDnsSuffix}", properties: j2, headers: j2 }, type: d2 }] }, { error: "DualStack is enabled but this partition does not support DualStack", type: c2 }] }, { endpoint: { url: "https://oidc.{Region}.{PartitionResult#dnsSuffix}", properties: j2, headers: j2 }, type: d2 }] }] };
var ruleSet2 = _data2;
var defaultEndpointResolver2 = (endpointParams, context = {}) => {
  return resolveEndpoint(ruleSet2, {
    endpointParams,
    logger: context.logger
  });
};
var getRuntimeConfig3 = (config) => {
  var _a, _b, _c, _d, _e, _f, _g, _h, _i;
  return {
    apiVersion: "2019-06-10",
    base64Decoder: (_a = config == null ? void 0 : config.base64Decoder) != null ? _a : fromBase64,
    base64Encoder: (_b = config == null ? void 0 : config.base64Encoder) != null ? _b : toBase64,
    disableHostPrefix: (_c = config == null ? void 0 : config.disableHostPrefix) != null ? _c : false,
    endpointProvider: (_d = config == null ? void 0 : config.endpointProvider) != null ? _d : defaultEndpointResolver2,
    logger: (_e = config == null ? void 0 : config.logger) != null ? _e : new NoOpLogger(),
    serviceId: (_f = config == null ? void 0 : config.serviceId) != null ? _f : "SSO OIDC",
    urlParser: (_g = config == null ? void 0 : config.urlParser) != null ? _g : parseUrl,
    utf8Decoder: (_h = config == null ? void 0 : config.utf8Decoder) != null ? _h : fromUtf84,
    utf8Encoder: (_i = config == null ? void 0 : config.utf8Encoder) != null ? _i : toUtf84
  };
};
var getRuntimeConfig22 = (config) => {
  var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j;
  emitWarningIfUnsupportedVersion(process.version);
  const defaultsMode = resolveDefaultsModeConfig(config);
  const defaultConfigProvider = () => defaultsMode().then(loadConfigsForDefaultMode);
  const clientSharedValues = getRuntimeConfig3(config);
  return {
    ...clientSharedValues,
    ...config,
    runtime: "node",
    defaultsMode,
    bodyLengthChecker: (_a = config == null ? void 0 : config.bodyLengthChecker) != null ? _a : calculateBodyLength,
    defaultUserAgentProvider: (_b = config == null ? void 0 : config.defaultUserAgentProvider) != null ? _b : defaultUserAgent({ serviceId: clientSharedValues.serviceId, clientVersion: package_default4.version }),
    maxAttempts: (_c = config == null ? void 0 : config.maxAttempts) != null ? _c : loadConfig(NODE_MAX_ATTEMPT_CONFIG_OPTIONS),
    region: (_d = config == null ? void 0 : config.region) != null ? _d : loadConfig(NODE_REGION_CONFIG_OPTIONS, NODE_REGION_CONFIG_FILE_OPTIONS),
    requestHandler: (_e = config == null ? void 0 : config.requestHandler) != null ? _e : new NodeHttpHandler(defaultConfigProvider),
    retryMode: (_f = config == null ? void 0 : config.retryMode) != null ? _f : loadConfig({
      ...NODE_RETRY_MODE_CONFIG_OPTIONS,
      default: async () => (await defaultConfigProvider()).retryMode || DEFAULT_RETRY_MODE
    }),
    sha256: (_g = config == null ? void 0 : config.sha256) != null ? _g : Hash.bind(null, "sha256"),
    streamCollector: (_h = config == null ? void 0 : config.streamCollector) != null ? _h : streamCollector,
    useDualstackEndpoint: (_i = config == null ? void 0 : config.useDualstackEndpoint) != null ? _i : loadConfig(NODE_USE_DUALSTACK_ENDPOINT_CONFIG_OPTIONS),
    useFipsEndpoint: (_j = config == null ? void 0 : config.useFipsEndpoint) != null ? _j : loadConfig(NODE_USE_FIPS_ENDPOINT_CONFIG_OPTIONS)
  };
};
var SSOOIDCClient = class extends Client {
  constructor(...[configuration]) {
    const _config_0 = getRuntimeConfig22(configuration || {});
    const _config_1 = resolveClientEndpointParameters4(_config_0);
    const _config_2 = resolveRegionConfig(_config_1);
    const _config_3 = resolveEndpointConfig(_config_2);
    const _config_4 = resolveRetryConfig(_config_3);
    const _config_5 = resolveHostHeaderConfig(_config_4);
    const _config_6 = resolveUserAgentConfig(_config_5);
    super(_config_6);
    this.config = _config_6;
    this.middlewareStack.use(getRetryPlugin(this.config));
    this.middlewareStack.use(getContentLengthPlugin(this.config));
    this.middlewareStack.use(getHostHeaderPlugin(this.config));
    this.middlewareStack.use(getLoggerPlugin(this.config));
    this.middlewareStack.use(getRecursionDetectionPlugin(this.config));
    this.middlewareStack.use(getUserAgentPlugin(this.config));
  }
  destroy() {
    super.destroy();
  }
};
var SSOOIDCServiceException = class _SSOOIDCServiceException extends ServiceException {
  constructor(options) {
    super(options);
    Object.setPrototypeOf(this, _SSOOIDCServiceException.prototype);
  }
};
var AccessDeniedException = class _AccessDeniedException extends SSOOIDCServiceException {
  constructor(opts) {
    super({
      name: "AccessDeniedException",
      $fault: "client",
      ...opts
    });
    this.name = "AccessDeniedException";
    this.$fault = "client";
    Object.setPrototypeOf(this, _AccessDeniedException.prototype);
    this.error = opts.error;
    this.error_description = opts.error_description;
  }
};
var AuthorizationPendingException = class _AuthorizationPendingException extends SSOOIDCServiceException {
  constructor(opts) {
    super({
      name: "AuthorizationPendingException",
      $fault: "client",
      ...opts
    });
    this.name = "AuthorizationPendingException";
    this.$fault = "client";
    Object.setPrototypeOf(this, _AuthorizationPendingException.prototype);
    this.error = opts.error;
    this.error_description = opts.error_description;
  }
};
var ExpiredTokenException2 = class _ExpiredTokenException extends SSOOIDCServiceException {
  constructor(opts) {
    super({
      name: "ExpiredTokenException",
      $fault: "client",
      ...opts
    });
    this.name = "ExpiredTokenException";
    this.$fault = "client";
    Object.setPrototypeOf(this, _ExpiredTokenException.prototype);
    this.error = opts.error;
    this.error_description = opts.error_description;
  }
};
var InternalServerException = class _InternalServerException extends SSOOIDCServiceException {
  constructor(opts) {
    super({
      name: "InternalServerException",
      $fault: "server",
      ...opts
    });
    this.name = "InternalServerException";
    this.$fault = "server";
    Object.setPrototypeOf(this, _InternalServerException.prototype);
    this.error = opts.error;
    this.error_description = opts.error_description;
  }
};
var InvalidClientException = class _InvalidClientException extends SSOOIDCServiceException {
  constructor(opts) {
    super({
      name: "InvalidClientException",
      $fault: "client",
      ...opts
    });
    this.name = "InvalidClientException";
    this.$fault = "client";
    Object.setPrototypeOf(this, _InvalidClientException.prototype);
    this.error = opts.error;
    this.error_description = opts.error_description;
  }
};
var InvalidGrantException = class _InvalidGrantException extends SSOOIDCServiceException {
  constructor(opts) {
    super({
      name: "InvalidGrantException",
      $fault: "client",
      ...opts
    });
    this.name = "InvalidGrantException";
    this.$fault = "client";
    Object.setPrototypeOf(this, _InvalidGrantException.prototype);
    this.error = opts.error;
    this.error_description = opts.error_description;
  }
};
var InvalidRequestException2 = class _InvalidRequestException extends SSOOIDCServiceException {
  constructor(opts) {
    super({
      name: "InvalidRequestException",
      $fault: "client",
      ...opts
    });
    this.name = "InvalidRequestException";
    this.$fault = "client";
    Object.setPrototypeOf(this, _InvalidRequestException.prototype);
    this.error = opts.error;
    this.error_description = opts.error_description;
  }
};
var InvalidScopeException = class _InvalidScopeException extends SSOOIDCServiceException {
  constructor(opts) {
    super({
      name: "InvalidScopeException",
      $fault: "client",
      ...opts
    });
    this.name = "InvalidScopeException";
    this.$fault = "client";
    Object.setPrototypeOf(this, _InvalidScopeException.prototype);
    this.error = opts.error;
    this.error_description = opts.error_description;
  }
};
var SlowDownException = class _SlowDownException extends SSOOIDCServiceException {
  constructor(opts) {
    super({
      name: "SlowDownException",
      $fault: "client",
      ...opts
    });
    this.name = "SlowDownException";
    this.$fault = "client";
    Object.setPrototypeOf(this, _SlowDownException.prototype);
    this.error = opts.error;
    this.error_description = opts.error_description;
  }
};
var UnauthorizedClientException = class _UnauthorizedClientException extends SSOOIDCServiceException {
  constructor(opts) {
    super({
      name: "UnauthorizedClientException",
      $fault: "client",
      ...opts
    });
    this.name = "UnauthorizedClientException";
    this.$fault = "client";
    Object.setPrototypeOf(this, _UnauthorizedClientException.prototype);
    this.error = opts.error;
    this.error_description = opts.error_description;
  }
};
var UnsupportedGrantTypeException = class _UnsupportedGrantTypeException extends SSOOIDCServiceException {
  constructor(opts) {
    super({
      name: "UnsupportedGrantTypeException",
      $fault: "client",
      ...opts
    });
    this.name = "UnsupportedGrantTypeException";
    this.$fault = "client";
    Object.setPrototypeOf(this, _UnsupportedGrantTypeException.prototype);
    this.error = opts.error;
    this.error_description = opts.error_description;
  }
};
var InvalidClientMetadataException = class _InvalidClientMetadataException extends SSOOIDCServiceException {
  constructor(opts) {
    super({
      name: "InvalidClientMetadataException",
      $fault: "client",
      ...opts
    });
    this.name = "InvalidClientMetadataException";
    this.$fault = "client";
    Object.setPrototypeOf(this, _InvalidClientMetadataException.prototype);
    this.error = opts.error;
    this.error_description = opts.error_description;
  }
};
var se_CreateTokenCommand = async (input, context) => {
  const { hostname, protocol = "https", port, path: basePath } = await context.endpoint();
  const headers = {
    "content-type": "application/json"
  };
  const resolvedPath2 = `${(basePath == null ? void 0 : basePath.endsWith("/")) ? basePath.slice(0, -1) : basePath || ""}/token`;
  let body;
  body = JSON.stringify(take(input, {
    clientId: [],
    clientSecret: [],
    code: [],
    deviceCode: [],
    grantType: [],
    redirectUri: [],
    refreshToken: [],
    scope: (_) => _json(_)
  }));
  return new HttpRequest({
    protocol,
    hostname,
    port,
    method: "POST",
    headers,
    path: resolvedPath2,
    body
  });
};
var se_RegisterClientCommand = async (input, context) => {
  const { hostname, protocol = "https", port, path: basePath } = await context.endpoint();
  const headers = {
    "content-type": "application/json"
  };
  const resolvedPath2 = `${(basePath == null ? void 0 : basePath.endsWith("/")) ? basePath.slice(0, -1) : basePath || ""}/client/register`;
  let body;
  body = JSON.stringify(take(input, {
    clientName: [],
    clientType: [],
    scopes: (_) => _json(_)
  }));
  return new HttpRequest({
    protocol,
    hostname,
    port,
    method: "POST",
    headers,
    path: resolvedPath2,
    body
  });
};
var se_StartDeviceAuthorizationCommand = async (input, context) => {
  const { hostname, protocol = "https", port, path: basePath } = await context.endpoint();
  const headers = {
    "content-type": "application/json"
  };
  const resolvedPath2 = `${(basePath == null ? void 0 : basePath.endsWith("/")) ? basePath.slice(0, -1) : basePath || ""}/device_authorization`;
  let body;
  body = JSON.stringify(take(input, {
    clientId: [],
    clientSecret: [],
    startUrl: []
  }));
  return new HttpRequest({
    protocol,
    hostname,
    port,
    method: "POST",
    headers,
    path: resolvedPath2,
    body
  });
};
var de_CreateTokenCommand = async (output, context) => {
  if (output.statusCode !== 200 && output.statusCode >= 300) {
    return de_CreateTokenCommandError(output, context);
  }
  const contents = map({
    $metadata: deserializeMetadata4(output)
  });
  const data = expectNonNull(expectObject(await parseBody3(output.body, context)), "body");
  const doc = take(data, {
    accessToken: expectString,
    expiresIn: expectInt32,
    idToken: expectString,
    refreshToken: expectString,
    tokenType: expectString
  });
  Object.assign(contents, doc);
  return contents;
};
var de_CreateTokenCommandError = async (output, context) => {
  const parsedOutput = {
    ...output,
    body: await parseErrorBody3(output.body, context)
  };
  const errorCode = loadRestJsonErrorCode2(output, parsedOutput.body);
  switch (errorCode) {
    case "AccessDeniedException":
    case "com.amazonaws.ssooidc#AccessDeniedException":
      throw await de_AccessDeniedExceptionRes(parsedOutput, context);
    case "AuthorizationPendingException":
    case "com.amazonaws.ssooidc#AuthorizationPendingException":
      throw await de_AuthorizationPendingExceptionRes(parsedOutput, context);
    case "ExpiredTokenException":
    case "com.amazonaws.ssooidc#ExpiredTokenException":
      throw await de_ExpiredTokenExceptionRes2(parsedOutput, context);
    case "InternalServerException":
    case "com.amazonaws.ssooidc#InternalServerException":
      throw await de_InternalServerExceptionRes(parsedOutput, context);
    case "InvalidClientException":
    case "com.amazonaws.ssooidc#InvalidClientException":
      throw await de_InvalidClientExceptionRes(parsedOutput, context);
    case "InvalidGrantException":
    case "com.amazonaws.ssooidc#InvalidGrantException":
      throw await de_InvalidGrantExceptionRes(parsedOutput, context);
    case "InvalidRequestException":
    case "com.amazonaws.ssooidc#InvalidRequestException":
      throw await de_InvalidRequestExceptionRes2(parsedOutput, context);
    case "InvalidScopeException":
    case "com.amazonaws.ssooidc#InvalidScopeException":
      throw await de_InvalidScopeExceptionRes(parsedOutput, context);
    case "SlowDownException":
    case "com.amazonaws.ssooidc#SlowDownException":
      throw await de_SlowDownExceptionRes(parsedOutput, context);
    case "UnauthorizedClientException":
    case "com.amazonaws.ssooidc#UnauthorizedClientException":
      throw await de_UnauthorizedClientExceptionRes(parsedOutput, context);
    case "UnsupportedGrantTypeException":
    case "com.amazonaws.ssooidc#UnsupportedGrantTypeException":
      throw await de_UnsupportedGrantTypeExceptionRes(parsedOutput, context);
    default:
      const parsedBody = parsedOutput.body;
      return throwDefaultError4({
        output,
        parsedBody,
        errorCode
      });
  }
};
var de_RegisterClientCommand = async (output, context) => {
  if (output.statusCode !== 200 && output.statusCode >= 300) {
    return de_RegisterClientCommandError(output, context);
  }
  const contents = map({
    $metadata: deserializeMetadata4(output)
  });
  const data = expectNonNull(expectObject(await parseBody3(output.body, context)), "body");
  const doc = take(data, {
    authorizationEndpoint: expectString,
    clientId: expectString,
    clientIdIssuedAt: expectLong,
    clientSecret: expectString,
    clientSecretExpiresAt: expectLong,
    tokenEndpoint: expectString
  });
  Object.assign(contents, doc);
  return contents;
};
var de_RegisterClientCommandError = async (output, context) => {
  const parsedOutput = {
    ...output,
    body: await parseErrorBody3(output.body, context)
  };
  const errorCode = loadRestJsonErrorCode2(output, parsedOutput.body);
  switch (errorCode) {
    case "InternalServerException":
    case "com.amazonaws.ssooidc#InternalServerException":
      throw await de_InternalServerExceptionRes(parsedOutput, context);
    case "InvalidClientMetadataException":
    case "com.amazonaws.ssooidc#InvalidClientMetadataException":
      throw await de_InvalidClientMetadataExceptionRes(parsedOutput, context);
    case "InvalidRequestException":
    case "com.amazonaws.ssooidc#InvalidRequestException":
      throw await de_InvalidRequestExceptionRes2(parsedOutput, context);
    case "InvalidScopeException":
    case "com.amazonaws.ssooidc#InvalidScopeException":
      throw await de_InvalidScopeExceptionRes(parsedOutput, context);
    default:
      const parsedBody = parsedOutput.body;
      return throwDefaultError4({
        output,
        parsedBody,
        errorCode
      });
  }
};
var de_StartDeviceAuthorizationCommand = async (output, context) => {
  if (output.statusCode !== 200 && output.statusCode >= 300) {
    return de_StartDeviceAuthorizationCommandError(output, context);
  }
  const contents = map({
    $metadata: deserializeMetadata4(output)
  });
  const data = expectNonNull(expectObject(await parseBody3(output.body, context)), "body");
  const doc = take(data, {
    deviceCode: expectString,
    expiresIn: expectInt32,
    interval: expectInt32,
    userCode: expectString,
    verificationUri: expectString,
    verificationUriComplete: expectString
  });
  Object.assign(contents, doc);
  return contents;
};
var de_StartDeviceAuthorizationCommandError = async (output, context) => {
  const parsedOutput = {
    ...output,
    body: await parseErrorBody3(output.body, context)
  };
  const errorCode = loadRestJsonErrorCode2(output, parsedOutput.body);
  switch (errorCode) {
    case "InternalServerException":
    case "com.amazonaws.ssooidc#InternalServerException":
      throw await de_InternalServerExceptionRes(parsedOutput, context);
    case "InvalidClientException":
    case "com.amazonaws.ssooidc#InvalidClientException":
      throw await de_InvalidClientExceptionRes(parsedOutput, context);
    case "InvalidRequestException":
    case "com.amazonaws.ssooidc#InvalidRequestException":
      throw await de_InvalidRequestExceptionRes2(parsedOutput, context);
    case "SlowDownException":
    case "com.amazonaws.ssooidc#SlowDownException":
      throw await de_SlowDownExceptionRes(parsedOutput, context);
    case "UnauthorizedClientException":
    case "com.amazonaws.ssooidc#UnauthorizedClientException":
      throw await de_UnauthorizedClientExceptionRes(parsedOutput, context);
    default:
      const parsedBody = parsedOutput.body;
      return throwDefaultError4({
        output,
        parsedBody,
        errorCode
      });
  }
};
var throwDefaultError4 = withBaseException(SSOOIDCServiceException);
var de_AccessDeniedExceptionRes = async (parsedOutput, context) => {
  const contents = map({});
  const data = parsedOutput.body;
  const doc = take(data, {
    error: expectString,
    error_description: expectString
  });
  Object.assign(contents, doc);
  const exception = new AccessDeniedException({
    $metadata: deserializeMetadata4(parsedOutput),
    ...contents
  });
  return decorateServiceException(exception, parsedOutput.body);
};
var de_AuthorizationPendingExceptionRes = async (parsedOutput, context) => {
  const contents = map({});
  const data = parsedOutput.body;
  const doc = take(data, {
    error: expectString,
    error_description: expectString
  });
  Object.assign(contents, doc);
  const exception = new AuthorizationPendingException({
    $metadata: deserializeMetadata4(parsedOutput),
    ...contents
  });
  return decorateServiceException(exception, parsedOutput.body);
};
var de_ExpiredTokenExceptionRes2 = async (parsedOutput, context) => {
  const contents = map({});
  const data = parsedOutput.body;
  const doc = take(data, {
    error: expectString,
    error_description: expectString
  });
  Object.assign(contents, doc);
  const exception = new ExpiredTokenException2({
    $metadata: deserializeMetadata4(parsedOutput),
    ...contents
  });
  return decorateServiceException(exception, parsedOutput.body);
};
var de_InternalServerExceptionRes = async (parsedOutput, context) => {
  const contents = map({});
  const data = parsedOutput.body;
  const doc = take(data, {
    error: expectString,
    error_description: expectString
  });
  Object.assign(contents, doc);
  const exception = new InternalServerException({
    $metadata: deserializeMetadata4(parsedOutput),
    ...contents
  });
  return decorateServiceException(exception, parsedOutput.body);
};
var de_InvalidClientExceptionRes = async (parsedOutput, context) => {
  const contents = map({});
  const data = parsedOutput.body;
  const doc = take(data, {
    error: expectString,
    error_description: expectString
  });
  Object.assign(contents, doc);
  const exception = new InvalidClientException({
    $metadata: deserializeMetadata4(parsedOutput),
    ...contents
  });
  return decorateServiceException(exception, parsedOutput.body);
};
var de_InvalidClientMetadataExceptionRes = async (parsedOutput, context) => {
  const contents = map({});
  const data = parsedOutput.body;
  const doc = take(data, {
    error: expectString,
    error_description: expectString
  });
  Object.assign(contents, doc);
  const exception = new InvalidClientMetadataException({
    $metadata: deserializeMetadata4(parsedOutput),
    ...contents
  });
  return decorateServiceException(exception, parsedOutput.body);
};
var de_InvalidGrantExceptionRes = async (parsedOutput, context) => {
  const contents = map({});
  const data = parsedOutput.body;
  const doc = take(data, {
    error: expectString,
    error_description: expectString
  });
  Object.assign(contents, doc);
  const exception = new InvalidGrantException({
    $metadata: deserializeMetadata4(parsedOutput),
    ...contents
  });
  return decorateServiceException(exception, parsedOutput.body);
};
var de_InvalidRequestExceptionRes2 = async (parsedOutput, context) => {
  const contents = map({});
  const data = parsedOutput.body;
  const doc = take(data, {
    error: expectString,
    error_description: expectString
  });
  Object.assign(contents, doc);
  const exception = new InvalidRequestException2({
    $metadata: deserializeMetadata4(parsedOutput),
    ...contents
  });
  return decorateServiceException(exception, parsedOutput.body);
};
var de_InvalidScopeExceptionRes = async (parsedOutput, context) => {
  const contents = map({});
  const data = parsedOutput.body;
  const doc = take(data, {
    error: expectString,
    error_description: expectString
  });
  Object.assign(contents, doc);
  const exception = new InvalidScopeException({
    $metadata: deserializeMetadata4(parsedOutput),
    ...contents
  });
  return decorateServiceException(exception, parsedOutput.body);
};
var de_SlowDownExceptionRes = async (parsedOutput, context) => {
  const contents = map({});
  const data = parsedOutput.body;
  const doc = take(data, {
    error: expectString,
    error_description: expectString
  });
  Object.assign(contents, doc);
  const exception = new SlowDownException({
    $metadata: deserializeMetadata4(parsedOutput),
    ...contents
  });
  return decorateServiceException(exception, parsedOutput.body);
};
var de_UnauthorizedClientExceptionRes = async (parsedOutput, context) => {
  const contents = map({});
  const data = parsedOutput.body;
  const doc = take(data, {
    error: expectString,
    error_description: expectString
  });
  Object.assign(contents, doc);
  const exception = new UnauthorizedClientException({
    $metadata: deserializeMetadata4(parsedOutput),
    ...contents
  });
  return decorateServiceException(exception, parsedOutput.body);
};
var de_UnsupportedGrantTypeExceptionRes = async (parsedOutput, context) => {
  const contents = map({});
  const data = parsedOutput.body;
  const doc = take(data, {
    error: expectString,
    error_description: expectString
  });
  Object.assign(contents, doc);
  const exception = new UnsupportedGrantTypeException({
    $metadata: deserializeMetadata4(parsedOutput),
    ...contents
  });
  return decorateServiceException(exception, parsedOutput.body);
};
var deserializeMetadata4 = (output) => {
  var _a, _b;
  return {
    httpStatusCode: output.statusCode,
    requestId: (_b = (_a = output.headers["x-amzn-requestid"]) != null ? _a : output.headers["x-amzn-request-id"]) != null ? _b : output.headers["x-amz-request-id"],
    extendedRequestId: output.headers["x-amz-id-2"],
    cfId: output.headers["x-amz-cf-id"]
  };
};
var collectBodyString3 = (streamBody, context) => collectBody(streamBody, context).then((body) => context.utf8Encoder(body));
var parseBody3 = (streamBody, context) => collectBodyString3(streamBody, context).then((encoded) => {
  if (encoded.length) {
    return JSON.parse(encoded);
  }
  return {};
});
var parseErrorBody3 = async (errorBody, context) => {
  var _a;
  const value = await parseBody3(errorBody, context);
  value.message = (_a = value.message) != null ? _a : value.Message;
  return value;
};
var loadRestJsonErrorCode2 = (output, data) => {
  const findKey = (object, key) => Object.keys(object).find((k22) => k22.toLowerCase() === key.toLowerCase());
  const sanitizeErrorCode = (rawValue) => {
    let cleanValue = rawValue;
    if (typeof cleanValue === "number") {
      cleanValue = cleanValue.toString();
    }
    if (cleanValue.indexOf(",") >= 0) {
      cleanValue = cleanValue.split(",")[0];
    }
    if (cleanValue.indexOf(":") >= 0) {
      cleanValue = cleanValue.split(":")[0];
    }
    if (cleanValue.indexOf("#") >= 0) {
      cleanValue = cleanValue.split("#")[1];
    }
    return cleanValue;
  };
  const headerKey = findKey(output.headers, "x-amzn-errortype");
  if (headerKey !== void 0) {
    return sanitizeErrorCode(output.headers[headerKey]);
  }
  if (data.code !== void 0) {
    return sanitizeErrorCode(data.code);
  }
  if (data["__type"] !== void 0) {
    return sanitizeErrorCode(data["__type"]);
  }
};
var CreateTokenCommand = class _CreateTokenCommand extends Command {
  constructor(input) {
    super();
    this.input = input;
  }
  static getEndpointParameterInstructions() {
    return {
      UseFIPS: { type: "builtInParams", name: "useFipsEndpoint" },
      Endpoint: { type: "builtInParams", name: "endpoint" },
      Region: { type: "builtInParams", name: "region" },
      UseDualStack: { type: "builtInParams", name: "useDualstackEndpoint" }
    };
  }
  resolveMiddleware(clientStack, configuration, options) {
    this.middlewareStack.use(getSerdePlugin(configuration, this.serialize, this.deserialize));
    this.middlewareStack.use(getEndpointPlugin(configuration, _CreateTokenCommand.getEndpointParameterInstructions()));
    const stack = clientStack.concat(this.middlewareStack);
    const { logger: logger2 } = configuration;
    const clientName = "SSOOIDCClient";
    const commandName = "CreateTokenCommand";
    const handlerExecutionContext = {
      logger: logger2,
      clientName,
      commandName,
      inputFilterSensitiveLog: (_) => _,
      outputFilterSensitiveLog: (_) => _
    };
    const { requestHandler } = configuration;
    return stack.resolve((request2) => requestHandler.handle(request2.request, options || {}), handlerExecutionContext);
  }
  serialize(input, context) {
    return se_CreateTokenCommand(input, context);
  }
  deserialize(output, context) {
    return de_CreateTokenCommand(output, context);
  }
};
var RegisterClientCommand = class _RegisterClientCommand extends Command {
  constructor(input) {
    super();
    this.input = input;
  }
  static getEndpointParameterInstructions() {
    return {
      UseFIPS: { type: "builtInParams", name: "useFipsEndpoint" },
      Endpoint: { type: "builtInParams", name: "endpoint" },
      Region: { type: "builtInParams", name: "region" },
      UseDualStack: { type: "builtInParams", name: "useDualstackEndpoint" }
    };
  }
  resolveMiddleware(clientStack, configuration, options) {
    this.middlewareStack.use(getSerdePlugin(configuration, this.serialize, this.deserialize));
    this.middlewareStack.use(getEndpointPlugin(configuration, _RegisterClientCommand.getEndpointParameterInstructions()));
    const stack = clientStack.concat(this.middlewareStack);
    const { logger: logger2 } = configuration;
    const clientName = "SSOOIDCClient";
    const commandName = "RegisterClientCommand";
    const handlerExecutionContext = {
      logger: logger2,
      clientName,
      commandName,
      inputFilterSensitiveLog: (_) => _,
      outputFilterSensitiveLog: (_) => _
    };
    const { requestHandler } = configuration;
    return stack.resolve((request2) => requestHandler.handle(request2.request, options || {}), handlerExecutionContext);
  }
  serialize(input, context) {
    return se_RegisterClientCommand(input, context);
  }
  deserialize(output, context) {
    return de_RegisterClientCommand(output, context);
  }
};
var StartDeviceAuthorizationCommand = class _StartDeviceAuthorizationCommand extends Command {
  constructor(input) {
    super();
    this.input = input;
  }
  static getEndpointParameterInstructions() {
    return {
      UseFIPS: { type: "builtInParams", name: "useFipsEndpoint" },
      Endpoint: { type: "builtInParams", name: "endpoint" },
      Region: { type: "builtInParams", name: "region" },
      UseDualStack: { type: "builtInParams", name: "useDualstackEndpoint" }
    };
  }
  resolveMiddleware(clientStack, configuration, options) {
    this.middlewareStack.use(getSerdePlugin(configuration, this.serialize, this.deserialize));
    this.middlewareStack.use(getEndpointPlugin(configuration, _StartDeviceAuthorizationCommand.getEndpointParameterInstructions()));
    const stack = clientStack.concat(this.middlewareStack);
    const { logger: logger2 } = configuration;
    const clientName = "SSOOIDCClient";
    const commandName = "StartDeviceAuthorizationCommand";
    const handlerExecutionContext = {
      logger: logger2,
      clientName,
      commandName,
      inputFilterSensitiveLog: (_) => _,
      outputFilterSensitiveLog: (_) => _
    };
    const { requestHandler } = configuration;
    return stack.resolve((request2) => requestHandler.handle(request2.request, options || {}), handlerExecutionContext);
  }
  serialize(input, context) {
    return se_StartDeviceAuthorizationCommand(input, context);
  }
  deserialize(output, context) {
    return de_StartDeviceAuthorizationCommand(output, context);
  }
};
var commands = {
  CreateTokenCommand,
  RegisterClientCommand,
  StartDeviceAuthorizationCommand
};
var SSOOIDC = class extends SSOOIDCClient {
};
createAggregatedClient(commands, SSOOIDC);

// node_modules/.pnpm/@aws-sdk+token-providers@3.408.0/node_modules/@aws-sdk/token-providers/dist-es/constants.js
var EXPIRE_WINDOW_MS = 5 * 60 * 1e3;
var REFRESH_MESSAGE = `To refresh this SSO session run 'aws sso login' with the corresponding profile.`;

// node_modules/.pnpm/@aws-sdk+token-providers@3.408.0/node_modules/@aws-sdk/token-providers/dist-es/getSsoOidcClient.js
var ssoOidcClientsHash = {};
var getSsoOidcClient = (ssoRegion) => {
  if (ssoOidcClientsHash[ssoRegion]) {
    return ssoOidcClientsHash[ssoRegion];
  }
  const ssoOidcClient = new SSOOIDCClient({ region: ssoRegion });
  ssoOidcClientsHash[ssoRegion] = ssoOidcClient;
  return ssoOidcClient;
};

// node_modules/.pnpm/@aws-sdk+token-providers@3.408.0/node_modules/@aws-sdk/token-providers/dist-es/getNewSsoOidcToken.js
var getNewSsoOidcToken = (ssoToken, ssoRegion) => {
  const ssoOidcClient = getSsoOidcClient(ssoRegion);
  return ssoOidcClient.send(new CreateTokenCommand({
    clientId: ssoToken.clientId,
    clientSecret: ssoToken.clientSecret,
    refreshToken: ssoToken.refreshToken,
    grantType: "refresh_token"
  }));
};

// node_modules/.pnpm/@aws-sdk+token-providers@3.408.0/node_modules/@aws-sdk/token-providers/dist-es/validateTokenExpiry.js
var validateTokenExpiry = (token) => {
  if (token.expiration && token.expiration.getTime() < Date.now()) {
    throw new TokenProviderError(`Token is expired. ${REFRESH_MESSAGE}`, false);
  }
};

// node_modules/.pnpm/@aws-sdk+token-providers@3.408.0/node_modules/@aws-sdk/token-providers/dist-es/validateTokenKey.js
var validateTokenKey = (key, value, forRefresh = false) => {
  if (typeof value === "undefined") {
    throw new TokenProviderError(`Value not present for '${key}' in SSO Token${forRefresh ? ". Cannot refresh" : ""}. ${REFRESH_MESSAGE}`, false);
  }
};

// node_modules/.pnpm/@aws-sdk+token-providers@3.408.0/node_modules/@aws-sdk/token-providers/dist-es/writeSSOTokenToFile.js
var import_fs4 = require("fs");
var { writeFile } = import_fs4.promises;
var writeSSOTokenToFile = (id, ssoToken) => {
  const tokenFilepath = getSSOTokenFilepath(id);
  const tokenString = JSON.stringify(ssoToken, null, 2);
  return writeFile(tokenFilepath, tokenString);
};

// node_modules/.pnpm/@aws-sdk+token-providers@3.408.0/node_modules/@aws-sdk/token-providers/dist-es/fromSso.js
var lastRefreshAttemptTime = /* @__PURE__ */ new Date(0);
var fromSso = (init = {}) => async () => {
  const profiles = await parseKnownFiles(init);
  const profileName = getProfileName(init);
  const profile = profiles[profileName];
  if (!profile) {
    throw new TokenProviderError(`Profile '${profileName}' could not be found in shared credentials file.`, false);
  } else if (!profile["sso_session"]) {
    throw new TokenProviderError(`Profile '${profileName}' is missing required property 'sso_session'.`);
  }
  const ssoSessionName = profile["sso_session"];
  const ssoSessions = await loadSsoSessionData(init);
  const ssoSession = ssoSessions[ssoSessionName];
  if (!ssoSession) {
    throw new TokenProviderError(`Sso session '${ssoSessionName}' could not be found in shared credentials file.`, false);
  }
  for (const ssoSessionRequiredKey of ["sso_start_url", "sso_region"]) {
    if (!ssoSession[ssoSessionRequiredKey]) {
      throw new TokenProviderError(`Sso session '${ssoSessionName}' is missing required property '${ssoSessionRequiredKey}'.`, false);
    }
  }
  const ssoStartUrl = ssoSession["sso_start_url"];
  const ssoRegion = ssoSession["sso_region"];
  let ssoToken;
  try {
    ssoToken = await getSSOTokenFromFile(ssoSessionName);
  } catch (e5) {
    throw new TokenProviderError(`The SSO session token associated with profile=${profileName} was not found or is invalid. ${REFRESH_MESSAGE}`, false);
  }
  validateTokenKey("accessToken", ssoToken.accessToken);
  validateTokenKey("expiresAt", ssoToken.expiresAt);
  const { accessToken, expiresAt } = ssoToken;
  const existingToken = { token: accessToken, expiration: new Date(expiresAt) };
  if (existingToken.expiration.getTime() - Date.now() > EXPIRE_WINDOW_MS) {
    return existingToken;
  }
  if (Date.now() - lastRefreshAttemptTime.getTime() < 30 * 1e3) {
    validateTokenExpiry(existingToken);
    return existingToken;
  }
  validateTokenKey("clientId", ssoToken.clientId, true);
  validateTokenKey("clientSecret", ssoToken.clientSecret, true);
  validateTokenKey("refreshToken", ssoToken.refreshToken, true);
  try {
    lastRefreshAttemptTime.setTime(Date.now());
    const newSsoOidcToken = await getNewSsoOidcToken(ssoToken, ssoRegion);
    validateTokenKey("accessToken", newSsoOidcToken.accessToken);
    validateTokenKey("expiresIn", newSsoOidcToken.expiresIn);
    const newTokenExpiration = new Date(Date.now() + newSsoOidcToken.expiresIn * 1e3);
    try {
      await writeSSOTokenToFile(ssoSessionName, {
        ...ssoToken,
        accessToken: newSsoOidcToken.accessToken,
        expiresAt: newTokenExpiration.toISOString(),
        refreshToken: newSsoOidcToken.refreshToken
      });
    } catch (error) {
    }
    return {
      token: newSsoOidcToken.accessToken,
      expiration: newTokenExpiration
    };
  } catch (error) {
    validateTokenExpiry(existingToken);
    return existingToken;
  }
};

// node_modules/.pnpm/@aws-sdk+credential-provider-sso@3.409.0/node_modules/@aws-sdk/credential-provider-sso/dist-es/resolveSSOCredentials.js
var SHOULD_FAIL_CREDENTIAL_CHAIN = false;
var resolveSSOCredentials = async ({ ssoStartUrl, ssoSession, ssoAccountId, ssoRegion, ssoRoleName, ssoClient, profile }) => {
  let token;
  const refreshMessage = `To refresh this SSO session run aws sso login with the corresponding profile.`;
  if (ssoSession) {
    try {
      const _token = await fromSso({ profile })();
      token = {
        accessToken: _token.token,
        expiresAt: new Date(_token.expiration).toISOString()
      };
    } catch (e5) {
      throw new CredentialsProviderError(e5.message, SHOULD_FAIL_CREDENTIAL_CHAIN);
    }
  } else {
    try {
      token = await getSSOTokenFromFile(ssoStartUrl);
    } catch (e5) {
      throw new CredentialsProviderError(`The SSO session associated with this profile is invalid. ${refreshMessage}`, SHOULD_FAIL_CREDENTIAL_CHAIN);
    }
  }
  if (new Date(token.expiresAt).getTime() - Date.now() <= 0) {
    throw new CredentialsProviderError(`The SSO session associated with this profile has expired. ${refreshMessage}`, SHOULD_FAIL_CREDENTIAL_CHAIN);
  }
  const { accessToken } = token;
  const sso = ssoClient || new SSOClient({ region: ssoRegion });
  let ssoResp;
  try {
    ssoResp = await sso.send(new GetRoleCredentialsCommand({
      accountId: ssoAccountId,
      roleName: ssoRoleName,
      accessToken
    }));
  } catch (e5) {
    throw CredentialsProviderError.from(e5, SHOULD_FAIL_CREDENTIAL_CHAIN);
  }
  const { roleCredentials: { accessKeyId, secretAccessKey, sessionToken, expiration } = {} } = ssoResp;
  if (!accessKeyId || !secretAccessKey || !sessionToken || !expiration) {
    throw new CredentialsProviderError("SSO returns an invalid temporary credential.", SHOULD_FAIL_CREDENTIAL_CHAIN);
  }
  return { accessKeyId, secretAccessKey, sessionToken, expiration: new Date(expiration) };
};

// node_modules/.pnpm/@aws-sdk+credential-provider-sso@3.409.0/node_modules/@aws-sdk/credential-provider-sso/dist-es/validateSsoProfile.js
var validateSsoProfile = (profile) => {
  const { sso_start_url, sso_account_id, sso_region, sso_role_name } = profile;
  if (!sso_start_url || !sso_account_id || !sso_region || !sso_role_name) {
    throw new CredentialsProviderError(`Profile is configured with invalid SSO credentials. Required parameters "sso_account_id", "sso_region", "sso_role_name", "sso_start_url". Got ${Object.keys(profile).join(", ")}
Reference: https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-sso.html`, false);
  }
  return profile;
};

// node_modules/.pnpm/@aws-sdk+credential-provider-sso@3.409.0/node_modules/@aws-sdk/credential-provider-sso/dist-es/fromSSO.js
var fromSSO = (init = {}) => async () => {
  const { ssoStartUrl, ssoAccountId, ssoRegion, ssoRoleName, ssoClient, ssoSession } = init;
  const profileName = getProfileName(init);
  if (!ssoStartUrl && !ssoAccountId && !ssoRegion && !ssoRoleName && !ssoSession) {
    const profiles = await parseKnownFiles(init);
    const profile = profiles[profileName];
    if (!profile) {
      throw new CredentialsProviderError(`Profile ${profileName} was not found.`);
    }
    if (!isSsoProfile(profile)) {
      throw new CredentialsProviderError(`Profile ${profileName} is not configured with SSO credentials.`);
    }
    if (profile == null ? void 0 : profile.sso_session) {
      const ssoSessions = await loadSsoSessionData(init);
      const session = ssoSessions[profile.sso_session];
      const conflictMsg = ` configurations in profile ${profileName} and sso-session ${profile.sso_session}`;
      if (ssoRegion && ssoRegion !== session.sso_region) {
        throw new CredentialsProviderError(`Conflicting SSO region` + conflictMsg, false);
      }
      if (ssoStartUrl && ssoStartUrl !== session.sso_start_url) {
        throw new CredentialsProviderError(`Conflicting SSO start_url` + conflictMsg, false);
      }
      profile.sso_region = session.sso_region;
      profile.sso_start_url = session.sso_start_url;
    }
    const { sso_start_url, sso_account_id, sso_region, sso_role_name, sso_session } = validateSsoProfile(profile);
    return resolveSSOCredentials({
      ssoStartUrl: sso_start_url,
      ssoSession: sso_session,
      ssoAccountId: sso_account_id,
      ssoRegion: sso_region,
      ssoRoleName: sso_role_name,
      ssoClient,
      profile: profileName
    });
  } else if (!ssoStartUrl || !ssoAccountId || !ssoRegion || !ssoRoleName) {
    throw new CredentialsProviderError('Incomplete configuration. The fromSSO() argument hash must include "ssoStartUrl", "ssoAccountId", "ssoRegion", "ssoRoleName"');
  } else {
    return resolveSSOCredentials({
      ssoStartUrl,
      ssoSession,
      ssoAccountId,
      ssoRegion,
      ssoRoleName,
      ssoClient,
      profile: profileName
    });
  }
};

// node_modules/.pnpm/@aws-sdk+credential-provider-ini@3.409.0/node_modules/@aws-sdk/credential-provider-ini/dist-es/resolveSsoCredentials.js
var resolveSsoCredentials = (data) => {
  const { sso_start_url, sso_account_id, sso_session, sso_region, sso_role_name } = validateSsoProfile(data);
  return fromSSO({
    ssoStartUrl: sso_start_url,
    ssoAccountId: sso_account_id,
    ssoSession: sso_session,
    ssoRegion: sso_region,
    ssoRoleName: sso_role_name
  })();
};

// node_modules/.pnpm/@aws-sdk+credential-provider-ini@3.409.0/node_modules/@aws-sdk/credential-provider-ini/dist-es/resolveStaticCredentials.js
var isStaticCredsProfile = (arg) => Boolean(arg) && typeof arg === "object" && typeof arg.aws_access_key_id === "string" && typeof arg.aws_secret_access_key === "string" && ["undefined", "string"].indexOf(typeof arg.aws_session_token) > -1;
var resolveStaticCredentials = (profile) => Promise.resolve({
  accessKeyId: profile.aws_access_key_id,
  secretAccessKey: profile.aws_secret_access_key,
  sessionToken: profile.aws_session_token
});

// node_modules/.pnpm/@aws-sdk+credential-provider-web-identity@3.408.0/node_modules/@aws-sdk/credential-provider-web-identity/dist-es/fromTokenFile.js
var import_fs5 = require("fs");

// node_modules/.pnpm/@aws-sdk+credential-provider-web-identity@3.408.0/node_modules/@aws-sdk/credential-provider-web-identity/dist-es/fromWebToken.js
var fromWebToken = (init) => () => {
  const { roleArn, roleSessionName, webIdentityToken, providerId, policyArns, policy, durationSeconds, roleAssumerWithWebIdentity } = init;
  if (!roleAssumerWithWebIdentity) {
    throw new CredentialsProviderError(`Role Arn '${roleArn}' needs to be assumed with web identity, but no role assumption callback was provided.`, false);
  }
  return roleAssumerWithWebIdentity({
    RoleArn: roleArn,
    RoleSessionName: roleSessionName != null ? roleSessionName : `aws-sdk-js-session-${Date.now()}`,
    WebIdentityToken: webIdentityToken,
    ProviderId: providerId,
    PolicyArns: policyArns,
    Policy: policy,
    DurationSeconds: durationSeconds
  });
};

// node_modules/.pnpm/@aws-sdk+credential-provider-web-identity@3.408.0/node_modules/@aws-sdk/credential-provider-web-identity/dist-es/fromTokenFile.js
var ENV_TOKEN_FILE = "AWS_WEB_IDENTITY_TOKEN_FILE";
var ENV_ROLE_ARN = "AWS_ROLE_ARN";
var ENV_ROLE_SESSION_NAME = "AWS_ROLE_SESSION_NAME";
var fromTokenFile = (init = {}) => async () => {
  var _a, _b, _c;
  const webIdentityTokenFile = (_a = init == null ? void 0 : init.webIdentityTokenFile) != null ? _a : process.env[ENV_TOKEN_FILE];
  const roleArn = (_b = init == null ? void 0 : init.roleArn) != null ? _b : process.env[ENV_ROLE_ARN];
  const roleSessionName = (_c = init == null ? void 0 : init.roleSessionName) != null ? _c : process.env[ENV_ROLE_SESSION_NAME];
  if (!webIdentityTokenFile || !roleArn) {
    throw new CredentialsProviderError("Web identity configuration not specified");
  }
  return fromWebToken({
    ...init,
    webIdentityToken: (0, import_fs5.readFileSync)(webIdentityTokenFile, { encoding: "ascii" }),
    roleArn,
    roleSessionName
  })();
};

// node_modules/.pnpm/@aws-sdk+credential-provider-ini@3.409.0/node_modules/@aws-sdk/credential-provider-ini/dist-es/resolveWebIdentityCredentials.js
var isWebIdentityProfile = (arg) => Boolean(arg) && typeof arg === "object" && typeof arg.web_identity_token_file === "string" && typeof arg.role_arn === "string" && ["undefined", "string"].indexOf(typeof arg.role_session_name) > -1;
var resolveWebIdentityCredentials = async (profile, options) => fromTokenFile({
  webIdentityTokenFile: profile.web_identity_token_file,
  roleArn: profile.role_arn,
  roleSessionName: profile.role_session_name,
  roleAssumerWithWebIdentity: options.roleAssumerWithWebIdentity
})();

// node_modules/.pnpm/@aws-sdk+credential-provider-ini@3.409.0/node_modules/@aws-sdk/credential-provider-ini/dist-es/resolveProfileData.js
var resolveProfileData = async (profileName, profiles, options, visitedProfiles = {}) => {
  const data = profiles[profileName];
  if (Object.keys(visitedProfiles).length > 0 && isStaticCredsProfile(data)) {
    return resolveStaticCredentials(data);
  }
  if (isAssumeRoleProfile(data)) {
    return resolveAssumeRoleCredentials(profileName, profiles, options, visitedProfiles);
  }
  if (isStaticCredsProfile(data)) {
    return resolveStaticCredentials(data);
  }
  if (isWebIdentityProfile(data)) {
    return resolveWebIdentityCredentials(data, options);
  }
  if (isProcessProfile(data)) {
    return resolveProcessCredentials2(options, profileName);
  }
  if (isSsoProfile(data)) {
    return resolveSsoCredentials(data);
  }
  throw new CredentialsProviderError(`Profile ${profileName} could not be found or parsed in shared credentials file.`);
};

// node_modules/.pnpm/@aws-sdk+credential-provider-ini@3.409.0/node_modules/@aws-sdk/credential-provider-ini/dist-es/fromIni.js
var fromIni = (init = {}) => async () => {
  const profiles = await parseKnownFiles(init);
  return resolveProfileData(getProfileName(init), profiles, init);
};

// node_modules/.pnpm/@aws-sdk+credential-provider-node@3.409.0/node_modules/@aws-sdk/credential-provider-node/dist-es/remoteProvider.js
var ENV_IMDS_DISABLED2 = "AWS_EC2_METADATA_DISABLED";
var remoteProvider = (init) => {
  if (process.env[ENV_CMDS_RELATIVE_URI] || process.env[ENV_CMDS_FULL_URI]) {
    return fromContainerMetadata(init);
  }
  if (process.env[ENV_IMDS_DISABLED2]) {
    return async () => {
      throw new CredentialsProviderError("EC2 Instance Metadata Service access disabled");
    };
  }
  return fromInstanceMetadata(init);
};

// node_modules/.pnpm/@aws-sdk+credential-provider-node@3.409.0/node_modules/@aws-sdk/credential-provider-node/dist-es/defaultProvider.js
var defaultProvider = (init = {}) => memoize(chain(...init.profile || process.env[ENV_PROFILE] ? [] : [fromEnv()], fromSSO(init), fromIni(init), fromProcess(init), fromTokenFile(init), remoteProvider(init), async () => {
  throw new CredentialsProviderError("Could not load credentials from any providers", false);
}), (credentials) => credentials.expiration !== void 0 && credentials.expiration.getTime() - Date.now() < 3e5, (credentials) => credentials.expiration !== void 0);

// node_modules/.pnpm/@aws-sdk+client-sts@3.409.0/node_modules/@aws-sdk/client-sts/dist-es/endpoint/ruleset.js
var F = "required";
var G = "type";
var H = "fn";
var I = "argv";
var J = "ref";
var a3 = false;
var b3 = true;
var c3 = "booleanEquals";
var d3 = "tree";
var e3 = "stringEquals";
var f3 = "sigv4";
var g3 = "sts";
var h3 = "us-east-1";
var i3 = "endpoint";
var j3 = "https://sts.{Region}.{PartitionResult#dnsSuffix}";
var k3 = "error";
var l3 = "getAttr";
var m3 = { [F]: false, [G]: "String" };
var n3 = { [F]: true, "default": false, [G]: "Boolean" };
var o3 = { [J]: "Endpoint" };
var p3 = { [H]: "isSet", [I]: [{ [J]: "Region" }] };
var q3 = { [J]: "Region" };
var r3 = { [H]: "aws.partition", [I]: [q3], "assign": "PartitionResult" };
var s3 = { [J]: "UseFIPS" };
var t2 = { [J]: "UseDualStack" };
var u = { "url": "https://sts.amazonaws.com", "properties": { "authSchemes": [{ "name": f3, "signingName": g3, "signingRegion": h3 }] }, "headers": {} };
var v = {};
var w = { "conditions": [{ [H]: e3, [I]: [q3, "aws-global"] }], [i3]: u, [G]: i3 };
var x = { [H]: c3, [I]: [s3, true] };
var y = { [H]: c3, [I]: [t2, true] };
var z = { [H]: c3, [I]: [true, { [H]: l3, [I]: [{ [J]: "PartitionResult" }, "supportsFIPS"] }] };
var A = { [J]: "PartitionResult" };
var B = { [H]: c3, [I]: [true, { [H]: l3, [I]: [A, "supportsDualStack"] }] };
var C = [{ [H]: "isSet", [I]: [o3] }];
var D = [x];
var E = [y];
var _data3 = { version: "1.0", parameters: { Region: m3, UseDualStack: n3, UseFIPS: n3, Endpoint: m3, UseGlobalEndpoint: n3 }, rules: [{ conditions: [{ [H]: c3, [I]: [{ [J]: "UseGlobalEndpoint" }, b3] }, { [H]: "not", [I]: C }, p3, r3, { [H]: c3, [I]: [s3, a3] }, { [H]: c3, [I]: [t2, a3] }], [G]: d3, rules: [{ conditions: [{ [H]: e3, [I]: [q3, "ap-northeast-1"] }], endpoint: u, [G]: i3 }, { conditions: [{ [H]: e3, [I]: [q3, "ap-south-1"] }], endpoint: u, [G]: i3 }, { conditions: [{ [H]: e3, [I]: [q3, "ap-southeast-1"] }], endpoint: u, [G]: i3 }, { conditions: [{ [H]: e3, [I]: [q3, "ap-southeast-2"] }], endpoint: u, [G]: i3 }, w, { conditions: [{ [H]: e3, [I]: [q3, "ca-central-1"] }], endpoint: u, [G]: i3 }, { conditions: [{ [H]: e3, [I]: [q3, "eu-central-1"] }], endpoint: u, [G]: i3 }, { conditions: [{ [H]: e3, [I]: [q3, "eu-north-1"] }], endpoint: u, [G]: i3 }, { conditions: [{ [H]: e3, [I]: [q3, "eu-west-1"] }], endpoint: u, [G]: i3 }, { conditions: [{ [H]: e3, [I]: [q3, "eu-west-2"] }], endpoint: u, [G]: i3 }, { conditions: [{ [H]: e3, [I]: [q3, "eu-west-3"] }], endpoint: u, [G]: i3 }, { conditions: [{ [H]: e3, [I]: [q3, "sa-east-1"] }], endpoint: u, [G]: i3 }, { conditions: [{ [H]: e3, [I]: [q3, h3] }], endpoint: u, [G]: i3 }, { conditions: [{ [H]: e3, [I]: [q3, "us-east-2"] }], endpoint: u, [G]: i3 }, { conditions: [{ [H]: e3, [I]: [q3, "us-west-1"] }], endpoint: u, [G]: i3 }, { conditions: [{ [H]: e3, [I]: [q3, "us-west-2"] }], endpoint: u, [G]: i3 }, { endpoint: { url: j3, properties: { authSchemes: [{ name: f3, signingName: g3, signingRegion: "{Region}" }] }, headers: v }, [G]: i3 }] }, { conditions: C, [G]: d3, rules: [{ conditions: D, error: "Invalid Configuration: FIPS and custom endpoint are not supported", [G]: k3 }, { conditions: E, error: "Invalid Configuration: Dualstack and custom endpoint are not supported", [G]: k3 }, { endpoint: { url: o3, properties: v, headers: v }, [G]: i3 }] }, { conditions: [p3], [G]: d3, rules: [{ conditions: [r3], [G]: d3, rules: [{ conditions: [x, y], [G]: d3, rules: [{ conditions: [z, B], [G]: d3, rules: [{ endpoint: { url: "https://sts-fips.{Region}.{PartitionResult#dualStackDnsSuffix}", properties: v, headers: v }, [G]: i3 }] }, { error: "FIPS and DualStack are enabled, but this partition does not support one or both", [G]: k3 }] }, { conditions: D, [G]: d3, rules: [{ conditions: [z], [G]: d3, rules: [{ conditions: [{ [H]: e3, [I]: ["aws-us-gov", { [H]: l3, [I]: [A, "name"] }] }], endpoint: { url: "https://sts.{Region}.amazonaws.com", properties: v, headers: v }, [G]: i3 }, { endpoint: { url: "https://sts-fips.{Region}.{PartitionResult#dnsSuffix}", properties: v, headers: v }, [G]: i3 }] }, { error: "FIPS is enabled but this partition does not support FIPS", [G]: k3 }] }, { conditions: E, [G]: d3, rules: [{ conditions: [B], [G]: d3, rules: [{ endpoint: { url: "https://sts.{Region}.{PartitionResult#dualStackDnsSuffix}", properties: v, headers: v }, [G]: i3 }] }, { error: "DualStack is enabled but this partition does not support DualStack", [G]: k3 }] }, w, { endpoint: { url: j3, properties: v, headers: v }, [G]: i3 }] }] }, { error: "Invalid Configuration: Missing Region", [G]: k3 }] };
var ruleSet3 = _data3;

// node_modules/.pnpm/@aws-sdk+client-sts@3.409.0/node_modules/@aws-sdk/client-sts/dist-es/endpoint/endpointResolver.js
var defaultEndpointResolver3 = (endpointParams, context = {}) => {
  return resolveEndpoint(ruleSet3, {
    endpointParams,
    logger: context.logger
  });
};

// node_modules/.pnpm/@aws-sdk+client-sts@3.409.0/node_modules/@aws-sdk/client-sts/dist-es/runtimeConfig.shared.js
var getRuntimeConfig4 = (config) => {
  var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j;
  return {
    apiVersion: "2011-06-15",
    base64Decoder: (_a = config == null ? void 0 : config.base64Decoder) != null ? _a : fromBase64,
    base64Encoder: (_b = config == null ? void 0 : config.base64Encoder) != null ? _b : toBase64,
    disableHostPrefix: (_c = config == null ? void 0 : config.disableHostPrefix) != null ? _c : false,
    endpointProvider: (_d = config == null ? void 0 : config.endpointProvider) != null ? _d : defaultEndpointResolver3,
    extensions: (_e = config == null ? void 0 : config.extensions) != null ? _e : [],
    logger: (_f = config == null ? void 0 : config.logger) != null ? _f : new NoOpLogger(),
    serviceId: (_g = config == null ? void 0 : config.serviceId) != null ? _g : "STS",
    urlParser: (_h = config == null ? void 0 : config.urlParser) != null ? _h : parseUrl,
    utf8Decoder: (_i = config == null ? void 0 : config.utf8Decoder) != null ? _i : fromUtf84,
    utf8Encoder: (_j = config == null ? void 0 : config.utf8Encoder) != null ? _j : toUtf84
  };
};

// node_modules/.pnpm/@aws-sdk+client-sts@3.409.0/node_modules/@aws-sdk/client-sts/dist-es/runtimeConfig.js
var getRuntimeConfig5 = (config) => {
  var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k;
  emitWarningIfUnsupportedVersion(process.version);
  const defaultsMode = resolveDefaultsModeConfig(config);
  const defaultConfigProvider = () => defaultsMode().then(loadConfigsForDefaultMode);
  const clientSharedValues = getRuntimeConfig4(config);
  return {
    ...clientSharedValues,
    ...config,
    runtime: "node",
    defaultsMode,
    bodyLengthChecker: (_a = config == null ? void 0 : config.bodyLengthChecker) != null ? _a : calculateBodyLength,
    credentialDefaultProvider: (_b = config == null ? void 0 : config.credentialDefaultProvider) != null ? _b : decorateDefaultCredentialProvider(defaultProvider),
    defaultUserAgentProvider: (_c = config == null ? void 0 : config.defaultUserAgentProvider) != null ? _c : defaultUserAgent({ serviceId: clientSharedValues.serviceId, clientVersion: package_default2.version }),
    maxAttempts: (_d = config == null ? void 0 : config.maxAttempts) != null ? _d : loadConfig(NODE_MAX_ATTEMPT_CONFIG_OPTIONS),
    region: (_e = config == null ? void 0 : config.region) != null ? _e : loadConfig(NODE_REGION_CONFIG_OPTIONS, NODE_REGION_CONFIG_FILE_OPTIONS),
    requestHandler: (_f = config == null ? void 0 : config.requestHandler) != null ? _f : new NodeHttpHandler(defaultConfigProvider),
    retryMode: (_g = config == null ? void 0 : config.retryMode) != null ? _g : loadConfig({
      ...NODE_RETRY_MODE_CONFIG_OPTIONS,
      default: async () => (await defaultConfigProvider()).retryMode || DEFAULT_RETRY_MODE
    }),
    sha256: (_h = config == null ? void 0 : config.sha256) != null ? _h : Hash.bind(null, "sha256"),
    streamCollector: (_i = config == null ? void 0 : config.streamCollector) != null ? _i : streamCollector,
    useDualstackEndpoint: (_j = config == null ? void 0 : config.useDualstackEndpoint) != null ? _j : loadConfig(NODE_USE_DUALSTACK_ENDPOINT_CONFIG_OPTIONS),
    useFipsEndpoint: (_k = config == null ? void 0 : config.useFipsEndpoint) != null ? _k : loadConfig(NODE_USE_FIPS_ENDPOINT_CONFIG_OPTIONS)
  };
};

// node_modules/.pnpm/@aws-sdk+client-sts@3.409.0/node_modules/@aws-sdk/client-sts/dist-es/runtimeExtensions.js
var asPartial2 = (t4) => t4;
var resolveRuntimeExtensions2 = (runtimeConfig, extensions) => {
  const extensionConfiguration = {
    ...asPartial2(getDefaultExtensionConfiguration(runtimeConfig))
  };
  extensions.forEach((extension) => extension.configure(extensionConfiguration));
  return {
    ...runtimeConfig,
    ...resolveDefaultRuntimeConfig(extensionConfiguration)
  };
};

// node_modules/.pnpm/@aws-sdk+client-sts@3.409.0/node_modules/@aws-sdk/client-sts/dist-es/STSClient.js
var STSClient = class _STSClient extends Client {
  constructor(...[configuration]) {
    const _config_0 = getRuntimeConfig5(configuration || {});
    const _config_1 = resolveClientEndpointParameters2(_config_0);
    const _config_2 = resolveRegionConfig(_config_1);
    const _config_3 = resolveEndpointConfig(_config_2);
    const _config_4 = resolveRetryConfig(_config_3);
    const _config_5 = resolveHostHeaderConfig(_config_4);
    const _config_6 = resolveStsAuthConfig(_config_5, { stsClientCtor: _STSClient });
    const _config_7 = resolveUserAgentConfig(_config_6);
    const _config_8 = resolveRuntimeExtensions2(_config_7, (configuration == null ? void 0 : configuration.extensions) || []);
    super(_config_8);
    this.config = _config_8;
    this.middlewareStack.use(getRetryPlugin(this.config));
    this.middlewareStack.use(getContentLengthPlugin(this.config));
    this.middlewareStack.use(getHostHeaderPlugin(this.config));
    this.middlewareStack.use(getLoggerPlugin(this.config));
    this.middlewareStack.use(getRecursionDetectionPlugin(this.config));
    this.middlewareStack.use(getUserAgentPlugin(this.config));
  }
  destroy() {
    super.destroy();
  }
};

// node_modules/.pnpm/@aws-sdk+client-sts@3.409.0/node_modules/@aws-sdk/client-sts/dist-es/defaultRoleAssumers.js
var getCustomizableStsClientCtor = (baseCtor, customizations) => {
  if (!customizations)
    return baseCtor;
  else
    return class CustomizableSTSClient extends baseCtor {
      constructor(config) {
        super(config);
        for (const customization of customizations) {
          this.middlewareStack.use(customization);
        }
      }
    };
};
var getDefaultRoleAssumer2 = (stsOptions = {}, stsPlugins) => getDefaultRoleAssumer(stsOptions, getCustomizableStsClientCtor(STSClient, stsPlugins));
var getDefaultRoleAssumerWithWebIdentity2 = (stsOptions = {}, stsPlugins) => getDefaultRoleAssumerWithWebIdentity(stsOptions, getCustomizableStsClientCtor(STSClient, stsPlugins));
var decorateDefaultCredentialProvider2 = (provider) => (input) => provider({
  roleAssumer: getDefaultRoleAssumer2(input),
  roleAssumerWithWebIdentity: getDefaultRoleAssumerWithWebIdentity2(input),
  ...input
});

// node_modules/.pnpm/@aws-sdk+middleware-bucket-endpoint@3.409.0/node_modules/@aws-sdk/middleware-bucket-endpoint/dist-es/NodeUseArnRegionConfigOptions.js
var NODE_USE_ARN_REGION_ENV_NAME = "AWS_S3_USE_ARN_REGION";
var NODE_USE_ARN_REGION_INI_NAME = "s3_use_arn_region";
var NODE_USE_ARN_REGION_CONFIG_OPTIONS = {
  environmentVariableSelector: (env2) => booleanSelector(env2, NODE_USE_ARN_REGION_ENV_NAME, SelectorType.ENV),
  configFileSelector: (profile) => booleanSelector(profile, NODE_USE_ARN_REGION_INI_NAME, SelectorType.CONFIG),
  default: false
};

// node_modules/.pnpm/@smithy+eventstream-serde-universal@2.0.6/node_modules/@smithy/eventstream-serde-universal/dist-es/getChunkedStream.js
function getChunkedStream(source) {
  let currentMessageTotalLength = 0;
  let currentMessagePendingLength = 0;
  let currentMessage = null;
  let messageLengthBuffer = null;
  const allocateMessage = (size) => {
    if (typeof size !== "number") {
      throw new Error("Attempted to allocate an event message where size was not a number: " + size);
    }
    currentMessageTotalLength = size;
    currentMessagePendingLength = 4;
    currentMessage = new Uint8Array(size);
    const currentMessageView = new DataView(currentMessage.buffer);
    currentMessageView.setUint32(0, size, false);
  };
  const iterator = async function* () {
    const sourceIterator = source[Symbol.asyncIterator]();
    while (true) {
      const { value, done } = await sourceIterator.next();
      if (done) {
        if (!currentMessageTotalLength) {
          return;
        } else if (currentMessageTotalLength === currentMessagePendingLength) {
          yield currentMessage;
        } else {
          throw new Error("Truncated event message received.");
        }
        return;
      }
      const chunkLength = value.length;
      let currentOffset = 0;
      while (currentOffset < chunkLength) {
        if (!currentMessage) {
          const bytesRemaining = chunkLength - currentOffset;
          if (!messageLengthBuffer) {
            messageLengthBuffer = new Uint8Array(4);
          }
          const numBytesForTotal = Math.min(4 - currentMessagePendingLength, bytesRemaining);
          messageLengthBuffer.set(value.slice(currentOffset, currentOffset + numBytesForTotal), currentMessagePendingLength);
          currentMessagePendingLength += numBytesForTotal;
          currentOffset += numBytesForTotal;
          if (currentMessagePendingLength < 4) {
            break;
          }
          allocateMessage(new DataView(messageLengthBuffer.buffer).getUint32(0, false));
          messageLengthBuffer = null;
        }
        const numBytesToWrite = Math.min(currentMessageTotalLength - currentMessagePendingLength, chunkLength - currentOffset);
        currentMessage.set(value.slice(currentOffset, currentOffset + numBytesToWrite), currentMessagePendingLength);
        currentMessagePendingLength += numBytesToWrite;
        currentOffset += numBytesToWrite;
        if (currentMessageTotalLength && currentMessageTotalLength === currentMessagePendingLength) {
          yield currentMessage;
          currentMessage = null;
          currentMessageTotalLength = 0;
          currentMessagePendingLength = 0;
        }
      }
    }
  };
  return {
    [Symbol.asyncIterator]: iterator
  };
}

// node_modules/.pnpm/@smithy+eventstream-serde-universal@2.0.6/node_modules/@smithy/eventstream-serde-universal/dist-es/getUnmarshalledStream.js
function getMessageUnmarshaller(deserializer, toUtf85) {
  return async function(message) {
    const { value: messageType } = message.headers[":message-type"];
    if (messageType === "error") {
      const unmodeledError = new Error(message.headers[":error-message"].value || "UnknownError");
      unmodeledError.name = message.headers[":error-code"].value;
      throw unmodeledError;
    } else if (messageType === "exception") {
      const code = message.headers[":exception-type"].value;
      const exception = { [code]: message };
      const deserializedException = await deserializer(exception);
      if (deserializedException.$unknown) {
        const error = new Error(toUtf85(message.body));
        error.name = code;
        throw error;
      }
      throw deserializedException[code];
    } else if (messageType === "event") {
      const event = {
        [message.headers[":event-type"].value]: message
      };
      const deserialized = await deserializer(event);
      if (deserialized.$unknown)
        return;
      return deserialized;
    } else {
      throw Error(`Unrecognizable event type: ${message.headers[":event-type"].value}`);
    }
  };
}

// node_modules/.pnpm/@smithy+eventstream-serde-universal@2.0.6/node_modules/@smithy/eventstream-serde-universal/dist-es/EventStreamMarshaller.js
var EventStreamMarshaller = class {
  constructor({ utf8Encoder, utf8Decoder }) {
    this.eventStreamCodec = new EventStreamCodec(utf8Encoder, utf8Decoder);
    this.utfEncoder = utf8Encoder;
  }
  deserialize(body, deserializer) {
    const inputStream = getChunkedStream(body);
    return new SmithyMessageDecoderStream({
      messageStream: new MessageDecoderStream({ inputStream, decoder: this.eventStreamCodec }),
      deserializer: getMessageUnmarshaller(deserializer, this.utfEncoder)
    });
  }
  serialize(inputStream, serializer) {
    return new MessageEncoderStream({
      messageStream: new SmithyMessageEncoderStream({ inputStream, serializer }),
      encoder: this.eventStreamCodec,
      includeEndFrame: true
    });
  }
};

// node_modules/.pnpm/@smithy+eventstream-serde-node@2.0.6/node_modules/@smithy/eventstream-serde-node/dist-es/EventStreamMarshaller.js
var import_stream5 = require("stream");

// node_modules/.pnpm/@smithy+eventstream-serde-node@2.0.6/node_modules/@smithy/eventstream-serde-node/dist-es/utils.js
async function* readabletoIterable(readStream) {
  let streamEnded = false;
  let generationEnded = false;
  const records = new Array();
  readStream.on("error", (err) => {
    if (!streamEnded) {
      streamEnded = true;
    }
    if (err) {
      throw err;
    }
  });
  readStream.on("data", (data) => {
    records.push(data);
  });
  readStream.on("end", () => {
    streamEnded = true;
  });
  while (!generationEnded) {
    const value = await new Promise((resolve2) => setTimeout(() => resolve2(records.shift()), 0));
    if (value) {
      yield value;
    }
    generationEnded = streamEnded && records.length === 0;
  }
}

// node_modules/.pnpm/@smithy+eventstream-serde-node@2.0.6/node_modules/@smithy/eventstream-serde-node/dist-es/EventStreamMarshaller.js
var EventStreamMarshaller2 = class {
  constructor({ utf8Encoder, utf8Decoder }) {
    this.universalMarshaller = new EventStreamMarshaller({
      utf8Decoder,
      utf8Encoder
    });
  }
  deserialize(body, deserializer) {
    const bodyIterable = typeof body[Symbol.asyncIterator] === "function" ? body : readabletoIterable(body);
    return this.universalMarshaller.deserialize(bodyIterable, deserializer);
  }
  serialize(input, serializer) {
    return import_stream5.Readable.from(this.universalMarshaller.serialize(input, serializer));
  }
};

// node_modules/.pnpm/@smithy+eventstream-serde-node@2.0.6/node_modules/@smithy/eventstream-serde-node/dist-es/provider.js
var eventStreamSerdeProvider = (options) => new EventStreamMarshaller2(options);

// node_modules/.pnpm/@smithy+hash-stream-node@2.0.6/node_modules/@smithy/hash-stream-node/dist-es/HashCalculator.js
var import_stream6 = require("stream");
var HashCalculator = class extends import_stream6.Writable {
  constructor(hash, options) {
    super(options);
    this.hash = hash;
  }
  _write(chunk, encoding, callback) {
    try {
      this.hash.update(toUint8Array(chunk));
    } catch (err) {
      return callback(err);
    }
    callback();
  }
};

// node_modules/.pnpm/@smithy+hash-stream-node@2.0.6/node_modules/@smithy/hash-stream-node/dist-es/readableStreamHasher.js
var readableStreamHasher = (hashCtor, readableStream) => {
  if (readableStream.readableFlowing !== null) {
    throw new Error("Unable to calculate hash for flowing readable stream");
  }
  const hash = new hashCtor();
  const hashCalculator = new HashCalculator(hash);
  readableStream.pipe(hashCalculator);
  return new Promise((resolve2, reject) => {
    readableStream.on("error", (err) => {
      hashCalculator.end();
      reject(err);
    });
    hashCalculator.on("error", reject);
    hashCalculator.on("finish", () => {
      hash.digest().then(resolve2).catch(reject);
    });
  });
};

// node_modules/.pnpm/@aws-sdk+signature-v4-multi-region@3.408.0/node_modules/@aws-sdk/signature-v4-multi-region/dist-es/SignatureV4MultiRegion.js
var SignatureV4MultiRegion = class {
  constructor(options) {
    this.sigv4Signer = new SignatureV4(options);
    this.signerOptions = options;
  }
  async sign(requestToSign, options = {}) {
    if (options.signingRegion === "*") {
      if (this.signerOptions.runtime !== "node")
        throw new Error("This request requires signing with SigV4Asymmetric algorithm. It's only available in Node.js");
      return this.getSigv4aSigner().sign(requestToSign, options);
    }
    return this.sigv4Signer.sign(requestToSign, options);
  }
  async presign(originalRequest, options = {}) {
    if (options.signingRegion === "*") {
      if (this.signerOptions.runtime !== "node")
        throw new Error("This request requires signing with SigV4Asymmetric algorithm. It's only available in Node.js");
      return this.getSigv4aSigner().presign(originalRequest, options);
    }
    return this.sigv4Signer.presign(originalRequest, options);
  }
  getSigv4aSigner() {
    if (!this.sigv4aSigner) {
      let CrtSignerV4;
      try {
        CrtSignerV4 = typeof require === "function" && require("@aws-sdk/signature-v4-crt").CrtSignerV4;
        if (typeof CrtSignerV4 !== "function")
          throw new Error();
      } catch (e5) {
        e5.message = `${e5.message}
Please check if you have installed "@aws-sdk/signature-v4-crt" package explicitly. 
For more information please go to https://github.com/aws/aws-sdk-js-v3#functionality-requiring-aws-common-runtime-crt`;
        throw e5;
      }
      this.sigv4aSigner = new CrtSignerV4({
        ...this.signerOptions,
        signingAlgorithm: 1
      });
    }
    return this.sigv4aSigner;
  }
};

// node_modules/.pnpm/@aws-sdk+client-s3@3.409.0/node_modules/@aws-sdk/client-s3/dist-es/endpoint/ruleset.js
var bJ = "required";
var bK = "type";
var bL = "conditions";
var bM = "fn";
var bN = "argv";
var bO = "ref";
var bP = "assign";
var bQ = "url";
var bR = "properties";
var bS = "authSchemes";
var bT = "disableDoubleEncoding";
var bU = "signingName";
var bV = "signingRegion";
var bW = "headers";
var a4 = false;
var b4 = true;
var c4 = "isSet";
var d4 = "tree";
var e4 = "booleanEquals";
var f4 = "error";
var g4 = "aws.partition";
var h4 = "stringEquals";
var i4 = "getAttr";
var j4 = "name";
var k4 = "substring";
var l4 = "hardwareType";
var m4 = "regionPrefix";
var n4 = "bucketAliasSuffix";
var o4 = "outpostId";
var p4 = "isValidHostLabel";
var q4 = "not";
var r4 = "parseURL";
var s4 = "s3-outposts";
var t3 = "endpoint";
var u2 = "aws.isVirtualHostableS3Bucket";
var v2 = "s3";
var w2 = "{url#scheme}://{url#authority}{url#normalizedPath}{Bucket}";
var x2 = "{url#scheme}://{Bucket}.{url#authority}{url#path}";
var y2 = "https://{Bucket}.s3-accelerate.{partitionResult#dnsSuffix}";
var z2 = "https://{Bucket}.s3.{partitionResult#dnsSuffix}";
var A2 = "aws.parseArn";
var B2 = "bucketArn";
var C2 = "arnType";
var D2 = "";
var E2 = "s3-object-lambda";
var F2 = "accesspoint";
var G2 = "accessPointName";
var H2 = "{url#scheme}://{accessPointName}-{bucketArn#accountId}.{url#authority}{url#path}";
var I2 = "mrapPartition";
var J2 = "outpostType";
var K = "arnPrefix";
var L = "{url#scheme}://{url#authority}{url#normalizedPath}{uri_encoded_bucket}";
var M = "https://s3.{partitionResult#dnsSuffix}/{uri_encoded_bucket}";
var N = "{url#scheme}://{url#authority}{url#path}";
var O = "https://s3.{partitionResult#dnsSuffix}";
var P = { [bJ]: false, [bK]: "String" };
var Q = { [bJ]: true, "default": false, [bK]: "Boolean" };
var R = { [bJ]: false, [bK]: "Boolean" };
var S = { [bM]: e4, [bN]: [{ [bO]: "Accelerate" }, true] };
var T = { [bM]: e4, [bN]: [{ [bO]: "UseFIPS" }, true] };
var U = { [bM]: e4, [bN]: [{ [bO]: "UseDualStack" }, true] };
var V = { [bM]: c4, [bN]: [{ [bO]: "Endpoint" }] };
var W = { [bM]: g4, [bN]: [{ [bO]: "Region" }], [bP]: "partitionResult" };
var X = { [bM]: h4, [bN]: [{ [bM]: i4, [bN]: [{ [bO]: "partitionResult" }, j4] }, "aws-cn"] };
var Y = { [bM]: c4, [bN]: [{ [bO]: "Bucket" }] };
var Z = { [bO]: "Bucket" };
var aa = { [bO]: l4 };
var ab = { [bL]: [{ [bM]: q4, [bN]: [V] }], [f4]: "Expected a endpoint to be specified but no endpoint was found", [bK]: f4 };
var ac = { [bM]: q4, [bN]: [V] };
var ad = { [bM]: r4, [bN]: [{ [bO]: "Endpoint" }], [bP]: "url" };
var ae = { [bS]: [{ [bT]: true, [j4]: "sigv4", [bU]: s4, [bV]: "{Region}" }] };
var af = {};
var ag = { [bM]: e4, [bN]: [{ [bO]: "ForcePathStyle" }, false] };
var ah = { [bO]: "ForcePathStyle" };
var ai = { [bM]: e4, [bN]: [{ [bO]: "Accelerate" }, false] };
var aj = { [bM]: h4, [bN]: [{ [bO]: "Region" }, "aws-global"] };
var ak = { [bS]: [{ [bT]: true, [j4]: "sigv4", [bU]: v2, [bV]: "us-east-1" }] };
var al = { [bM]: q4, [bN]: [aj] };
var am = { [bM]: e4, [bN]: [{ [bO]: "UseGlobalEndpoint" }, true] };
var an = { [bQ]: "https://{Bucket}.s3-fips.dualstack.{Region}.{partitionResult#dnsSuffix}", [bR]: { [bS]: [{ [bT]: true, [j4]: "sigv4", [bU]: v2, [bV]: "{Region}" }] }, [bW]: {} };
var ao = { [bS]: [{ [bT]: true, [j4]: "sigv4", [bU]: v2, [bV]: "{Region}" }] };
var ap = { [bM]: e4, [bN]: [{ [bO]: "UseGlobalEndpoint" }, false] };
var aq = { [bM]: e4, [bN]: [{ [bO]: "UseDualStack" }, false] };
var ar = { [bQ]: "https://{Bucket}.s3-fips.{Region}.{partitionResult#dnsSuffix}", [bR]: ao, [bW]: {} };
var as = { [bM]: e4, [bN]: [{ [bO]: "UseFIPS" }, false] };
var at = { [bQ]: "https://{Bucket}.s3-accelerate.dualstack.{partitionResult#dnsSuffix}", [bR]: ao, [bW]: {} };
var au = { [bQ]: "https://{Bucket}.s3.dualstack.{Region}.{partitionResult#dnsSuffix}", [bR]: ao, [bW]: {} };
var av = { [bM]: e4, [bN]: [{ [bM]: i4, [bN]: [{ [bO]: "url" }, "isIp"] }, true] };
var aw = { [bO]: "url" };
var ax = { [bM]: e4, [bN]: [{ [bM]: i4, [bN]: [aw, "isIp"] }, false] };
var ay = { [bQ]: w2, [bR]: ao, [bW]: {} };
var az = { [bQ]: x2, [bR]: ao, [bW]: {} };
var aA = { [t3]: az, [bK]: t3 };
var aB = { [bQ]: y2, [bR]: ao, [bW]: {} };
var aC = { [bQ]: "https://{Bucket}.s3.{Region}.{partitionResult#dnsSuffix}", [bR]: ao, [bW]: {} };
var aD = { [f4]: "Invalid region: region was not a valid DNS name.", [bK]: f4 };
var aE = { [bO]: B2 };
var aF = { [bO]: C2 };
var aG = { [bM]: i4, [bN]: [aE, "service"] };
var aH = { [bO]: G2 };
var aI = { [bL]: [U], [f4]: "S3 Object Lambda does not support Dual-stack", [bK]: f4 };
var aJ = { [bL]: [S], [f4]: "S3 Object Lambda does not support S3 Accelerate", [bK]: f4 };
var aK = { [bL]: [{ [bM]: c4, [bN]: [{ [bO]: "DisableAccessPoints" }] }, { [bM]: e4, [bN]: [{ [bO]: "DisableAccessPoints" }, true] }], [f4]: "Access points are not supported for this operation", [bK]: f4 };
var aL = { [bL]: [{ [bM]: c4, [bN]: [{ [bO]: "UseArnRegion" }] }, { [bM]: e4, [bN]: [{ [bO]: "UseArnRegion" }, false] }, { [bM]: q4, [bN]: [{ [bM]: h4, [bN]: [{ [bM]: i4, [bN]: [aE, "region"] }, "{Region}"] }] }], [f4]: "Invalid configuration: region from ARN `{bucketArn#region}` does not match client region `{Region}` and UseArnRegion is `false`", [bK]: f4 };
var aM = { [bM]: i4, [bN]: [{ [bO]: "bucketPartition" }, j4] };
var aN = { [bM]: i4, [bN]: [aE, "accountId"] };
var aO = { [bS]: [{ [bT]: true, [j4]: "sigv4", [bU]: E2, [bV]: "{bucketArn#region}" }] };
var aP = { [f4]: "Invalid ARN: The access point name may only contain a-z, A-Z, 0-9 and `-`. Found: `{accessPointName}`", [bK]: f4 };
var aQ = { [f4]: "Invalid ARN: The account id may only contain a-z, A-Z, 0-9 and `-`. Found: `{bucketArn#accountId}`", [bK]: f4 };
var aR = { [f4]: "Invalid region in ARN: `{bucketArn#region}` (invalid DNS name)", [bK]: f4 };
var aS = { [f4]: "Client was configured for partition `{partitionResult#name}` but ARN (`{Bucket}`) has `{bucketPartition#name}`", [bK]: f4 };
var aT = { [f4]: "Invalid ARN: The ARN may only contain a single resource component after `accesspoint`.", [bK]: f4 };
var aU = { [f4]: "Invalid ARN: Expected a resource of the format `accesspoint:<accesspoint name>` but no name was provided", [bK]: f4 };
var aV = { [bS]: [{ [bT]: true, [j4]: "sigv4", [bU]: v2, [bV]: "{bucketArn#region}" }] };
var aW = { [bS]: [{ [bT]: true, [j4]: "sigv4", [bU]: s4, [bV]: "{bucketArn#region}" }] };
var aX = { [bM]: A2, [bN]: [Z] };
var aY = { [bQ]: "https://s3-fips.dualstack.{Region}.{partitionResult#dnsSuffix}/{uri_encoded_bucket}", [bR]: ao, [bW]: {} };
var aZ = { [bQ]: "https://s3-fips.{Region}.{partitionResult#dnsSuffix}/{uri_encoded_bucket}", [bR]: ao, [bW]: {} };
var ba = { [bQ]: "https://s3.dualstack.{Region}.{partitionResult#dnsSuffix}/{uri_encoded_bucket}", [bR]: ao, [bW]: {} };
var bb = { [bQ]: L, [bR]: ao, [bW]: {} };
var bc = { [bQ]: "https://s3.{Region}.{partitionResult#dnsSuffix}/{uri_encoded_bucket}", [bR]: ao, [bW]: {} };
var bd = { [bO]: "UseObjectLambdaEndpoint" };
var be = { [bS]: [{ [bT]: true, [j4]: "sigv4", [bU]: E2, [bV]: "{Region}" }] };
var bf = { [bQ]: "https://s3-fips.dualstack.{Region}.{partitionResult#dnsSuffix}", [bR]: ao, [bW]: {} };
var bg = { [bQ]: "https://s3-fips.{Region}.{partitionResult#dnsSuffix}", [bR]: ao, [bW]: {} };
var bh = { [bQ]: "https://s3.dualstack.{Region}.{partitionResult#dnsSuffix}", [bR]: ao, [bW]: {} };
var bi = { [bQ]: N, [bR]: ao, [bW]: {} };
var bj = { [bQ]: "https://s3.{Region}.{partitionResult#dnsSuffix}", [bR]: ao, [bW]: {} };
var bk = [{ [bO]: "Region" }];
var bl = [{ [bO]: "Endpoint" }];
var bm = [Z];
var bn = [{ [bM]: p4, [bN]: [{ [bO]: o4 }, false] }];
var bo = [{ [bM]: h4, [bN]: [{ [bO]: m4 }, "beta"] }];
var bp = [V, ad];
var bq = [Y];
var br = [W];
var bs = [{ [bM]: p4, [bN]: [{ [bO]: "Region" }, false] }];
var bt = [{ [bM]: h4, [bN]: [{ [bO]: "Region" }, "us-east-1"] }];
var bu = [{ [bM]: h4, [bN]: [aF, F2] }];
var bv = [{ [bM]: i4, [bN]: [aE, "resourceId[1]"], [bP]: G2 }, { [bM]: q4, [bN]: [{ [bM]: h4, [bN]: [aH, D2] }] }];
var bw = [aE, "resourceId[1]"];
var bx = [U];
var by = [S];
var bz = [{ [bM]: q4, [bN]: [{ [bM]: h4, [bN]: [{ [bM]: i4, [bN]: [aE, "region"] }, D2] }] }];
var bA = [{ [bM]: q4, [bN]: [{ [bM]: c4, [bN]: [{ [bM]: i4, [bN]: [aE, "resourceId[2]"] }] }] }];
var bB = [aE, "resourceId[2]"];
var bC = [{ [bM]: g4, [bN]: [{ [bM]: i4, [bN]: [aE, "region"] }], [bP]: "bucketPartition" }];
var bD = [{ [bM]: h4, [bN]: [aM, { [bM]: i4, [bN]: [{ [bO]: "partitionResult" }, j4] }] }];
var bE = [{ [bM]: p4, [bN]: [{ [bM]: i4, [bN]: [aE, "region"] }, true] }];
var bF = [{ [bM]: p4, [bN]: [aN, false] }];
var bG = [{ [bM]: p4, [bN]: [aH, false] }];
var bH = [T];
var bI = [{ [bM]: p4, [bN]: [{ [bO]: "Region" }, true] }];
var _data4 = { version: "1.0", parameters: { Bucket: P, Region: P, UseFIPS: Q, UseDualStack: Q, Endpoint: P, ForcePathStyle: Q, Accelerate: Q, UseGlobalEndpoint: Q, UseObjectLambdaEndpoint: R, DisableAccessPoints: R, DisableMultiRegionAccessPoints: Q, UseArnRegion: R }, rules: [{ [bL]: [{ [bM]: c4, [bN]: bk }], [bK]: d4, rules: [{ [bL]: [S, T], error: "Accelerate cannot be used with FIPS", [bK]: f4 }, { [bL]: [U, V], error: "Cannot set dual-stack in combination with a custom endpoint.", [bK]: f4 }, { [bL]: [V, T], error: "A custom endpoint cannot be combined with FIPS", [bK]: f4 }, { [bL]: [V, S], error: "A custom endpoint cannot be combined with S3 Accelerate", [bK]: f4 }, { [bL]: [T, W, X], error: "Partition does not support FIPS", [bK]: f4 }, { [bL]: [Y, { [bM]: k4, [bN]: [Z, 49, 50, b4], [bP]: l4 }, { [bM]: k4, [bN]: [Z, 8, 12, b4], [bP]: m4 }, { [bM]: k4, [bN]: [Z, 0, 7, b4], [bP]: n4 }, { [bM]: k4, [bN]: [Z, 32, 49, b4], [bP]: o4 }, { [bM]: g4, [bN]: bk, [bP]: "regionPartition" }, { [bM]: h4, [bN]: [{ [bO]: n4 }, "--op-s3"] }], [bK]: d4, rules: [{ [bL]: bn, [bK]: d4, rules: [{ [bL]: [{ [bM]: h4, [bN]: [aa, "e"] }], [bK]: d4, rules: [{ [bL]: bo, [bK]: d4, rules: [ab, { [bL]: bp, endpoint: { [bQ]: "https://{Bucket}.ec2.{url#authority}", [bR]: ae, [bW]: af }, [bK]: t3 }] }, { endpoint: { [bQ]: "https://{Bucket}.ec2.s3-outposts.{Region}.{regionPartition#dnsSuffix}", [bR]: ae, [bW]: af }, [bK]: t3 }] }, { [bL]: [{ [bM]: h4, [bN]: [aa, "o"] }], [bK]: d4, rules: [{ [bL]: bo, [bK]: d4, rules: [ab, { [bL]: bp, endpoint: { [bQ]: "https://{Bucket}.op-{outpostId}.{url#authority}", [bR]: ae, [bW]: af }, [bK]: t3 }] }, { endpoint: { [bQ]: "https://{Bucket}.op-{outpostId}.s3-outposts.{Region}.{regionPartition#dnsSuffix}", [bR]: ae, [bW]: af }, [bK]: t3 }] }, { error: 'Unrecognized hardware type: "Expected hardware type o or e but got {hardwareType}"', [bK]: f4 }] }, { error: "Invalid ARN: The outpost Id must only contain a-z, A-Z, 0-9 and `-`.", [bK]: f4 }] }, { [bL]: bq, [bK]: d4, rules: [{ [bL]: [V, { [bM]: q4, [bN]: [{ [bM]: c4, [bN]: [{ [bM]: r4, [bN]: bl }] }] }], error: "Custom endpoint `{Endpoint}` was not a valid URI", [bK]: f4 }, { [bL]: [ag, { [bM]: u2, [bN]: [Z, a4] }], [bK]: d4, rules: [{ [bL]: br, [bK]: d4, rules: [{ [bL]: bs, [bK]: d4, rules: [{ [bL]: [S, X], error: "S3 Accelerate cannot be used in this region", [bK]: f4 }, { [bL]: [U, T, ai, ac, aj], endpoint: { [bQ]: "https://{Bucket}.s3-fips.dualstack.us-east-1.{partitionResult#dnsSuffix}", [bR]: ak, [bW]: af }, [bK]: t3 }, { [bL]: [U, T, ai, ac, al, am], [bK]: d4, rules: [{ endpoint: an, [bK]: t3 }] }, { [bL]: [U, T, ai, ac, al, ap], endpoint: an, [bK]: t3 }, { [bL]: [aq, T, ai, ac, aj], endpoint: { [bQ]: "https://{Bucket}.s3-fips.us-east-1.{partitionResult#dnsSuffix}", [bR]: ak, [bW]: af }, [bK]: t3 }, { [bL]: [aq, T, ai, ac, al, am], [bK]: d4, rules: [{ endpoint: ar, [bK]: t3 }] }, { [bL]: [aq, T, ai, ac, al, ap], endpoint: ar, [bK]: t3 }, { [bL]: [U, as, S, ac, aj], endpoint: { [bQ]: "https://{Bucket}.s3-accelerate.dualstack.us-east-1.{partitionResult#dnsSuffix}", [bR]: ak, [bW]: af }, [bK]: t3 }, { [bL]: [U, as, S, ac, al, am], [bK]: d4, rules: [{ endpoint: at, [bK]: t3 }] }, { [bL]: [U, as, S, ac, al, ap], endpoint: at, [bK]: t3 }, { [bL]: [U, as, ai, ac, aj], endpoint: { [bQ]: "https://{Bucket}.s3.dualstack.us-east-1.{partitionResult#dnsSuffix}", [bR]: ak, [bW]: af }, [bK]: t3 }, { [bL]: [U, as, ai, ac, al, am], [bK]: d4, rules: [{ endpoint: au, [bK]: t3 }] }, { [bL]: [U, as, ai, ac, al, ap], endpoint: au, [bK]: t3 }, { [bL]: [aq, as, ai, V, ad, av, aj], endpoint: { [bQ]: w2, [bR]: ak, [bW]: af }, [bK]: t3 }, { [bL]: [aq, as, ai, V, ad, ax, aj], endpoint: { [bQ]: x2, [bR]: ak, [bW]: af }, [bK]: t3 }, { [bL]: [aq, as, ai, V, ad, av, al, am], [bK]: d4, rules: [{ [bL]: bt, endpoint: ay, [bK]: t3 }, { endpoint: ay, [bK]: t3 }] }, { [bL]: [aq, as, ai, V, ad, ax, al, am], [bK]: d4, rules: [{ [bL]: bt, endpoint: az, [bK]: t3 }, aA] }, { [bL]: [aq, as, ai, V, ad, av, al, ap], endpoint: ay, [bK]: t3 }, { [bL]: [aq, as, ai, V, ad, ax, al, ap], endpoint: az, [bK]: t3 }, { [bL]: [aq, as, S, ac, aj], endpoint: { [bQ]: y2, [bR]: ak, [bW]: af }, [bK]: t3 }, { [bL]: [aq, as, S, ac, al, am], [bK]: d4, rules: [{ [bL]: bt, endpoint: aB, [bK]: t3 }, { endpoint: aB, [bK]: t3 }] }, { [bL]: [aq, as, S, ac, al, ap], endpoint: aB, [bK]: t3 }, { [bL]: [aq, as, ai, ac, aj], endpoint: { [bQ]: z2, [bR]: ak, [bW]: af }, [bK]: t3 }, { [bL]: [aq, as, ai, ac, al, am], [bK]: d4, rules: [{ [bL]: bt, endpoint: { [bQ]: z2, [bR]: ao, [bW]: af }, [bK]: t3 }, { endpoint: aC, [bK]: t3 }] }, { [bL]: [aq, as, ai, ac, al, ap], endpoint: aC, [bK]: t3 }] }, aD] }] }, { [bL]: [V, ad, { [bM]: h4, [bN]: [{ [bM]: i4, [bN]: [aw, "scheme"] }, "http"] }, { [bM]: u2, [bN]: [Z, b4] }, ag, as, aq, ai], [bK]: d4, rules: [{ [bL]: br, [bK]: d4, rules: [{ [bL]: bs, [bK]: d4, rules: [aA] }, aD] }] }, { [bL]: [ag, { [bM]: A2, [bN]: bm, [bP]: B2 }], [bK]: d4, rules: [{ [bL]: [{ [bM]: i4, [bN]: [aE, "resourceId[0]"], [bP]: C2 }, { [bM]: q4, [bN]: [{ [bM]: h4, [bN]: [aF, D2] }] }], [bK]: d4, rules: [{ [bL]: [{ [bM]: h4, [bN]: [aG, E2] }], [bK]: d4, rules: [{ [bL]: bu, [bK]: d4, rules: [{ [bL]: bv, [bK]: d4, rules: [aI, aJ, { [bL]: bz, [bK]: d4, rules: [aK, { [bL]: bA, [bK]: d4, rules: [aL, { [bL]: bC, [bK]: d4, rules: [{ [bL]: br, [bK]: d4, rules: [{ [bL]: bD, [bK]: d4, rules: [{ [bL]: bE, [bK]: d4, rules: [{ [bL]: [{ [bM]: h4, [bN]: [aN, D2] }], error: "Invalid ARN: Missing account id", [bK]: f4 }, { [bL]: bF, [bK]: d4, rules: [{ [bL]: bG, [bK]: d4, rules: [{ [bL]: bp, endpoint: { [bQ]: H2, [bR]: aO, [bW]: af }, [bK]: t3 }, { [bL]: bH, endpoint: { [bQ]: "https://{accessPointName}-{bucketArn#accountId}.s3-object-lambda-fips.{bucketArn#region}.{bucketPartition#dnsSuffix}", [bR]: aO, [bW]: af }, [bK]: t3 }, { endpoint: { [bQ]: "https://{accessPointName}-{bucketArn#accountId}.s3-object-lambda.{bucketArn#region}.{bucketPartition#dnsSuffix}", [bR]: aO, [bW]: af }, [bK]: t3 }] }, aP] }, aQ] }, aR] }, aS] }] }] }, aT] }, { error: "Invalid ARN: bucket ARN is missing a region", [bK]: f4 }] }, aU] }, { error: "Invalid ARN: Object Lambda ARNs only support `accesspoint` arn types, but found: `{arnType}`", [bK]: f4 }] }, { [bL]: bu, [bK]: d4, rules: [{ [bL]: bv, [bK]: d4, rules: [{ [bL]: bz, [bK]: d4, rules: [{ [bL]: bu, [bK]: d4, rules: [{ [bL]: bz, [bK]: d4, rules: [aK, { [bL]: bA, [bK]: d4, rules: [aL, { [bL]: bC, [bK]: d4, rules: [{ [bL]: br, [bK]: d4, rules: [{ [bL]: [{ [bM]: h4, [bN]: [aM, "{partitionResult#name}"] }], [bK]: d4, rules: [{ [bL]: bE, [bK]: d4, rules: [{ [bL]: [{ [bM]: h4, [bN]: [aG, v2] }], [bK]: d4, rules: [{ [bL]: bF, [bK]: d4, rules: [{ [bL]: bG, [bK]: d4, rules: [{ [bL]: by, error: "Access Points do not support S3 Accelerate", [bK]: f4 }, { [bL]: [T, U], endpoint: { [bQ]: "https://{accessPointName}-{bucketArn#accountId}.s3-accesspoint-fips.dualstack.{bucketArn#region}.{bucketPartition#dnsSuffix}", [bR]: aV, [bW]: af }, [bK]: t3 }, { [bL]: [T, aq], endpoint: { [bQ]: "https://{accessPointName}-{bucketArn#accountId}.s3-accesspoint-fips.{bucketArn#region}.{bucketPartition#dnsSuffix}", [bR]: aV, [bW]: af }, [bK]: t3 }, { [bL]: [as, U], endpoint: { [bQ]: "https://{accessPointName}-{bucketArn#accountId}.s3-accesspoint.dualstack.{bucketArn#region}.{bucketPartition#dnsSuffix}", [bR]: aV, [bW]: af }, [bK]: t3 }, { [bL]: [as, aq, V, ad], endpoint: { [bQ]: H2, [bR]: aV, [bW]: af }, [bK]: t3 }, { [bL]: [as, aq], endpoint: { [bQ]: "https://{accessPointName}-{bucketArn#accountId}.s3-accesspoint.{bucketArn#region}.{bucketPartition#dnsSuffix}", [bR]: aV, [bW]: af }, [bK]: t3 }] }, aP] }, aQ] }, { error: "Invalid ARN: The ARN was not for the S3 service, found: {bucketArn#service}", [bK]: f4 }] }, aR] }, aS] }] }] }, aT] }] }] }, { [bL]: [{ [bM]: p4, [bN]: [aH, b4] }], [bK]: d4, rules: [{ [bL]: bx, error: "S3 MRAP does not support dual-stack", [bK]: f4 }, { [bL]: bH, error: "S3 MRAP does not support FIPS", [bK]: f4 }, { [bL]: by, error: "S3 MRAP does not support S3 Accelerate", [bK]: f4 }, { [bL]: [{ [bM]: e4, [bN]: [{ [bO]: "DisableMultiRegionAccessPoints" }, b4] }], error: "Invalid configuration: Multi-Region Access Point ARNs are disabled.", [bK]: f4 }, { [bL]: [{ [bM]: g4, [bN]: bk, [bP]: I2 }], [bK]: d4, rules: [{ [bL]: [{ [bM]: h4, [bN]: [{ [bM]: i4, [bN]: [{ [bO]: I2 }, j4] }, { [bM]: i4, [bN]: [aE, "partition"] }] }], [bK]: d4, rules: [{ endpoint: { [bQ]: "https://{accessPointName}.accesspoint.s3-global.{mrapPartition#dnsSuffix}", [bR]: { [bS]: [{ [bT]: b4, name: "sigv4a", [bU]: v2, signingRegionSet: ["*"] }] }, [bW]: af }, [bK]: t3 }] }, { error: "Client was configured for partition `{mrapPartition#name}` but bucket referred to partition `{bucketArn#partition}`", [bK]: f4 }] }] }, { error: "Invalid Access Point Name", [bK]: f4 }] }, aU] }, { [bL]: [{ [bM]: h4, [bN]: [aG, s4] }], [bK]: d4, rules: [{ [bL]: bx, error: "S3 Outposts does not support Dual-stack", [bK]: f4 }, { [bL]: bH, error: "S3 Outposts does not support FIPS", [bK]: f4 }, { [bL]: by, error: "S3 Outposts does not support S3 Accelerate", [bK]: f4 }, { [bL]: [{ [bM]: c4, [bN]: [{ [bM]: i4, [bN]: [aE, "resourceId[4]"] }] }], error: "Invalid Arn: Outpost Access Point ARN contains sub resources", [bK]: f4 }, { [bL]: [{ [bM]: i4, [bN]: bw, [bP]: o4 }], [bK]: d4, rules: [{ [bL]: bn, [bK]: d4, rules: [aL, { [bL]: bC, [bK]: d4, rules: [{ [bL]: br, [bK]: d4, rules: [{ [bL]: bD, [bK]: d4, rules: [{ [bL]: bE, [bK]: d4, rules: [{ [bL]: bF, [bK]: d4, rules: [{ [bL]: [{ [bM]: i4, [bN]: bB, [bP]: J2 }], [bK]: d4, rules: [{ [bL]: [{ [bM]: i4, [bN]: [aE, "resourceId[3]"], [bP]: G2 }], [bK]: d4, rules: [{ [bL]: [{ [bM]: h4, [bN]: [{ [bO]: J2 }, F2] }], [bK]: d4, rules: [{ [bL]: bp, endpoint: { [bQ]: "https://{accessPointName}-{bucketArn#accountId}.{outpostId}.{url#authority}", [bR]: aW, [bW]: af }, [bK]: t3 }, { endpoint: { [bQ]: "https://{accessPointName}-{bucketArn#accountId}.{outpostId}.s3-outposts.{bucketArn#region}.{bucketPartition#dnsSuffix}", [bR]: aW, [bW]: af }, [bK]: t3 }] }, { error: "Expected an outpost type `accesspoint`, found {outpostType}", [bK]: f4 }] }, { error: "Invalid ARN: expected an access point name", [bK]: f4 }] }, { error: "Invalid ARN: Expected a 4-component resource", [bK]: f4 }] }, aQ] }, aR] }, aS] }] }] }, { error: "Invalid ARN: The outpost Id may only contain a-z, A-Z, 0-9 and `-`. Found: `{outpostId}`", [bK]: f4 }] }, { error: "Invalid ARN: The Outpost Id was not set", [bK]: f4 }] }, { error: "Invalid ARN: Unrecognized format: {Bucket} (type: {arnType})", [bK]: f4 }] }, { error: "Invalid ARN: No ARN type specified", [bK]: f4 }] }, { [bL]: [{ [bM]: k4, [bN]: [Z, 0, 4, a4], [bP]: K }, { [bM]: h4, [bN]: [{ [bO]: K }, "arn:"] }, { [bM]: q4, [bN]: [{ [bM]: c4, [bN]: [aX] }] }], error: "Invalid ARN: `{Bucket}` was not a valid ARN", [bK]: f4 }, { [bL]: [{ [bM]: e4, [bN]: [ah, b4] }, aX], error: "Path-style addressing cannot be used with ARN buckets", [bK]: f4 }, { [bL]: [{ [bM]: "uriEncode", [bN]: bm, [bP]: "uri_encoded_bucket" }], [bK]: d4, rules: [{ [bL]: br, [bK]: d4, rules: [{ [bL]: [ai], [bK]: d4, rules: [{ [bL]: [U, ac, T, aj], endpoint: { [bQ]: "https://s3-fips.dualstack.us-east-1.{partitionResult#dnsSuffix}/{uri_encoded_bucket}", [bR]: ak, [bW]: af }, [bK]: t3 }, { [bL]: [U, ac, T, al, am], [bK]: d4, rules: [{ endpoint: aY, [bK]: t3 }] }, { [bL]: [U, ac, T, al, ap], endpoint: aY, [bK]: t3 }, { [bL]: [aq, ac, T, aj], endpoint: { [bQ]: "https://s3-fips.us-east-1.{partitionResult#dnsSuffix}/{uri_encoded_bucket}", [bR]: ak, [bW]: af }, [bK]: t3 }, { [bL]: [aq, ac, T, al, am], [bK]: d4, rules: [{ endpoint: aZ, [bK]: t3 }] }, { [bL]: [aq, ac, T, al, ap], endpoint: aZ, [bK]: t3 }, { [bL]: [U, ac, as, aj], endpoint: { [bQ]: "https://s3.dualstack.us-east-1.{partitionResult#dnsSuffix}/{uri_encoded_bucket}", [bR]: ak, [bW]: af }, [bK]: t3 }, { [bL]: [U, ac, as, al, am], [bK]: d4, rules: [{ endpoint: ba, [bK]: t3 }] }, { [bL]: [U, ac, as, al, ap], endpoint: ba, [bK]: t3 }, { [bL]: [aq, V, ad, as, aj], endpoint: { [bQ]: L, [bR]: ak, [bW]: af }, [bK]: t3 }, { [bL]: [aq, V, ad, as, al, am], [bK]: d4, rules: [{ [bL]: bt, endpoint: bb, [bK]: t3 }, { endpoint: bb, [bK]: t3 }] }, { [bL]: [aq, V, ad, as, al, ap], endpoint: bb, [bK]: t3 }, { [bL]: [aq, ac, as, aj], endpoint: { [bQ]: M, [bR]: ak, [bW]: af }, [bK]: t3 }, { [bL]: [aq, ac, as, al, am], [bK]: d4, rules: [{ [bL]: bt, endpoint: { [bQ]: M, [bR]: ao, [bW]: af }, [bK]: t3 }, { endpoint: bc, [bK]: t3 }] }, { [bL]: [aq, ac, as, al, ap], endpoint: bc, [bK]: t3 }] }, { error: "Path-style addressing cannot be used with S3 Accelerate", [bK]: f4 }] }] }] }, { [bL]: [{ [bM]: c4, [bN]: [bd] }, { [bM]: e4, [bN]: [bd, b4] }], [bK]: d4, rules: [{ [bL]: br, [bK]: d4, rules: [{ [bL]: bI, [bK]: d4, rules: [aI, aJ, { [bL]: bp, endpoint: { [bQ]: N, [bR]: be, [bW]: af }, [bK]: t3 }, { [bL]: bH, endpoint: { [bQ]: "https://s3-object-lambda-fips.{Region}.{partitionResult#dnsSuffix}", [bR]: be, [bW]: af }, [bK]: t3 }, { endpoint: { [bQ]: "https://s3-object-lambda.{Region}.{partitionResult#dnsSuffix}", [bR]: be, [bW]: af }, [bK]: t3 }] }, aD] }] }, { [bL]: [{ [bM]: q4, [bN]: bq }], [bK]: d4, rules: [{ [bL]: br, [bK]: d4, rules: [{ [bL]: bI, [bK]: d4, rules: [{ [bL]: [T, U, ac, aj], endpoint: { [bQ]: "https://s3-fips.dualstack.us-east-1.{partitionResult#dnsSuffix}", [bR]: ak, [bW]: af }, [bK]: t3 }, { [bL]: [T, U, ac, al, am], [bK]: d4, rules: [{ endpoint: bf, [bK]: t3 }] }, { [bL]: [T, U, ac, al, ap], endpoint: bf, [bK]: t3 }, { [bL]: [T, aq, ac, aj], endpoint: { [bQ]: "https://s3-fips.us-east-1.{partitionResult#dnsSuffix}", [bR]: ak, [bW]: af }, [bK]: t3 }, { [bL]: [T, aq, ac, al, am], [bK]: d4, rules: [{ endpoint: bg, [bK]: t3 }] }, { [bL]: [T, aq, ac, al, ap], endpoint: bg, [bK]: t3 }, { [bL]: [as, U, ac, aj], endpoint: { [bQ]: "https://s3.dualstack.us-east-1.{partitionResult#dnsSuffix}", [bR]: ak, [bW]: af }, [bK]: t3 }, { [bL]: [as, U, ac, al, am], [bK]: d4, rules: [{ endpoint: bh, [bK]: t3 }] }, { [bL]: [as, U, ac, al, ap], endpoint: bh, [bK]: t3 }, { [bL]: [as, aq, V, ad, aj], endpoint: { [bQ]: N, [bR]: ak, [bW]: af }, [bK]: t3 }, { [bL]: [as, aq, V, ad, al, am], [bK]: d4, rules: [{ [bL]: bt, endpoint: bi, [bK]: t3 }, { endpoint: bi, [bK]: t3 }] }, { [bL]: [as, aq, V, ad, al, ap], endpoint: bi, [bK]: t3 }, { [bL]: [as, aq, ac, aj], endpoint: { [bQ]: O, [bR]: ak, [bW]: af }, [bK]: t3 }, { [bL]: [as, aq, ac, al, am], [bK]: d4, rules: [{ [bL]: bt, endpoint: { [bQ]: O, [bR]: ao, [bW]: af }, [bK]: t3 }, { endpoint: bj, [bK]: t3 }] }, { [bL]: [as, aq, ac, al, ap], endpoint: bj, [bK]: t3 }] }, aD] }] }] }, { error: "A region must be set when sending requests to S3.", [bK]: f4 }] };
var ruleSet4 = _data4;

// node_modules/.pnpm/@aws-sdk+client-s3@3.409.0/node_modules/@aws-sdk/client-s3/dist-es/endpoint/endpointResolver.js
var defaultEndpointResolver4 = (endpointParams, context = {}) => {
  return resolveEndpoint(ruleSet4, {
    endpointParams,
    logger: context.logger
  });
};

// node_modules/.pnpm/@aws-sdk+client-s3@3.409.0/node_modules/@aws-sdk/client-s3/dist-es/runtimeConfig.shared.js
var getRuntimeConfig6 = (config) => {
  var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m, _n, _o;
  return {
    apiVersion: "2006-03-01",
    base64Decoder: (_a = config == null ? void 0 : config.base64Decoder) != null ? _a : fromBase64,
    base64Encoder: (_b = config == null ? void 0 : config.base64Encoder) != null ? _b : toBase64,
    disableHostPrefix: (_c = config == null ? void 0 : config.disableHostPrefix) != null ? _c : false,
    endpointProvider: (_d = config == null ? void 0 : config.endpointProvider) != null ? _d : defaultEndpointResolver4,
    extensions: (_e = config == null ? void 0 : config.extensions) != null ? _e : [],
    getAwsChunkedEncodingStream: (_f = config == null ? void 0 : config.getAwsChunkedEncodingStream) != null ? _f : getAwsChunkedEncodingStream,
    logger: (_g = config == null ? void 0 : config.logger) != null ? _g : new NoOpLogger(),
    sdkStreamMixin: (_h = config == null ? void 0 : config.sdkStreamMixin) != null ? _h : sdkStreamMixin,
    serviceId: (_i = config == null ? void 0 : config.serviceId) != null ? _i : "S3",
    signerConstructor: (_j = config == null ? void 0 : config.signerConstructor) != null ? _j : SignatureV4MultiRegion,
    signingEscapePath: (_k = config == null ? void 0 : config.signingEscapePath) != null ? _k : false,
    urlParser: (_l = config == null ? void 0 : config.urlParser) != null ? _l : parseUrl,
    useArnRegion: (_m = config == null ? void 0 : config.useArnRegion) != null ? _m : false,
    utf8Decoder: (_n = config == null ? void 0 : config.utf8Decoder) != null ? _n : fromUtf84,
    utf8Encoder: (_o = config == null ? void 0 : config.utf8Encoder) != null ? _o : toUtf84
  };
};

// node_modules/.pnpm/@aws-sdk+client-s3@3.409.0/node_modules/@aws-sdk/client-s3/dist-es/runtimeConfig.js
var getRuntimeConfig7 = (config) => {
  var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m, _n, _o, _p;
  emitWarningIfUnsupportedVersion(process.version);
  const defaultsMode = resolveDefaultsModeConfig(config);
  const defaultConfigProvider = () => defaultsMode().then(loadConfigsForDefaultMode);
  const clientSharedValues = getRuntimeConfig6(config);
  return {
    ...clientSharedValues,
    ...config,
    runtime: "node",
    defaultsMode,
    bodyLengthChecker: (_a = config == null ? void 0 : config.bodyLengthChecker) != null ? _a : calculateBodyLength,
    credentialDefaultProvider: (_b = config == null ? void 0 : config.credentialDefaultProvider) != null ? _b : decorateDefaultCredentialProvider2(defaultProvider),
    defaultUserAgentProvider: (_c = config == null ? void 0 : config.defaultUserAgentProvider) != null ? _c : defaultUserAgent({ serviceId: clientSharedValues.serviceId, clientVersion: package_default.version }),
    eventStreamSerdeProvider: (_d = config == null ? void 0 : config.eventStreamSerdeProvider) != null ? _d : eventStreamSerdeProvider,
    maxAttempts: (_e = config == null ? void 0 : config.maxAttempts) != null ? _e : loadConfig(NODE_MAX_ATTEMPT_CONFIG_OPTIONS),
    md5: (_f = config == null ? void 0 : config.md5) != null ? _f : Hash.bind(null, "md5"),
    region: (_g = config == null ? void 0 : config.region) != null ? _g : loadConfig(NODE_REGION_CONFIG_OPTIONS, NODE_REGION_CONFIG_FILE_OPTIONS),
    requestHandler: (_h = config == null ? void 0 : config.requestHandler) != null ? _h : new NodeHttpHandler(defaultConfigProvider),
    retryMode: (_i = config == null ? void 0 : config.retryMode) != null ? _i : loadConfig({
      ...NODE_RETRY_MODE_CONFIG_OPTIONS,
      default: async () => (await defaultConfigProvider()).retryMode || DEFAULT_RETRY_MODE
    }),
    sha1: (_j = config == null ? void 0 : config.sha1) != null ? _j : Hash.bind(null, "sha1"),
    sha256: (_k = config == null ? void 0 : config.sha256) != null ? _k : Hash.bind(null, "sha256"),
    streamCollector: (_l = config == null ? void 0 : config.streamCollector) != null ? _l : streamCollector,
    streamHasher: (_m = config == null ? void 0 : config.streamHasher) != null ? _m : readableStreamHasher,
    useArnRegion: (_n = config == null ? void 0 : config.useArnRegion) != null ? _n : loadConfig(NODE_USE_ARN_REGION_CONFIG_OPTIONS),
    useDualstackEndpoint: (_o = config == null ? void 0 : config.useDualstackEndpoint) != null ? _o : loadConfig(NODE_USE_DUALSTACK_ENDPOINT_CONFIG_OPTIONS),
    useFipsEndpoint: (_p = config == null ? void 0 : config.useFipsEndpoint) != null ? _p : loadConfig(NODE_USE_FIPS_ENDPOINT_CONFIG_OPTIONS)
  };
};

// node_modules/.pnpm/@aws-sdk+client-s3@3.409.0/node_modules/@aws-sdk/client-s3/dist-es/runtimeExtensions.js
var asPartial3 = (t4) => t4;
var resolveRuntimeExtensions3 = (runtimeConfig, extensions) => {
  const extensionConfiguration = {
    ...asPartial3(getDefaultExtensionConfiguration(runtimeConfig))
  };
  extensions.forEach((extension) => extension.configure(extensionConfiguration));
  return {
    ...runtimeConfig,
    ...resolveDefaultRuntimeConfig(extensionConfiguration)
  };
};

// node_modules/.pnpm/@aws-sdk+client-s3@3.409.0/node_modules/@aws-sdk/client-s3/dist-es/S3Client.js
var S3Client = class extends Client {
  constructor(...[configuration]) {
    const _config_0 = getRuntimeConfig7(configuration || {});
    const _config_1 = resolveClientEndpointParameters(_config_0);
    const _config_2 = resolveRegionConfig(_config_1);
    const _config_3 = resolveEndpointConfig(_config_2);
    const _config_4 = resolveRetryConfig(_config_3);
    const _config_5 = resolveHostHeaderConfig(_config_4);
    const _config_6 = resolveAwsAuthConfig(_config_5);
    const _config_7 = resolveS3Config(_config_6);
    const _config_8 = resolveUserAgentConfig(_config_7);
    const _config_9 = resolveEventStreamSerdeConfig(_config_8);
    const _config_10 = resolveRuntimeExtensions3(_config_9, (configuration == null ? void 0 : configuration.extensions) || []);
    super(_config_10);
    this.config = _config_10;
    this.middlewareStack.use(getRetryPlugin(this.config));
    this.middlewareStack.use(getContentLengthPlugin(this.config));
    this.middlewareStack.use(getHostHeaderPlugin(this.config));
    this.middlewareStack.use(getLoggerPlugin(this.config));
    this.middlewareStack.use(getRecursionDetectionPlugin(this.config));
    this.middlewareStack.use(getAwsAuthPlugin(this.config));
    this.middlewareStack.use(getValidateBucketNamePlugin(this.config));
    this.middlewareStack.use(getAddExpectContinuePlugin(this.config));
    this.middlewareStack.use(getUserAgentPlugin(this.config));
  }
  destroy() {
    super.destroy();
  }
};

// node_modules/.pnpm/@aws-sdk+client-s3@3.409.0/node_modules/@aws-sdk/client-s3/dist-es/protocols/Aws_restXml.js
var import_fast_xml_parser2 = __toESM(require_fxp());

// node_modules/.pnpm/@aws-sdk+client-s3@3.409.0/node_modules/@aws-sdk/client-s3/dist-es/models/S3ServiceException.js
var S3ServiceException = class _S3ServiceException extends ServiceException {
  constructor(options) {
    super(options);
    Object.setPrototypeOf(this, _S3ServiceException.prototype);
  }
};

// node_modules/.pnpm/@aws-sdk+client-s3@3.409.0/node_modules/@aws-sdk/client-s3/dist-es/models/models_0.js
var AnalyticsFilter;
(function(AnalyticsFilter2) {
  AnalyticsFilter2.visit = (value, visitor) => {
    if (value.Prefix !== void 0)
      return visitor.Prefix(value.Prefix);
    if (value.Tag !== void 0)
      return visitor.Tag(value.Tag);
    if (value.And !== void 0)
      return visitor.And(value.And);
    return visitor._(value.$unknown[0], value.$unknown[1]);
  };
})(AnalyticsFilter || (AnalyticsFilter = {}));
var LifecycleRuleFilter;
(function(LifecycleRuleFilter2) {
  LifecycleRuleFilter2.visit = (value, visitor) => {
    if (value.Prefix !== void 0)
      return visitor.Prefix(value.Prefix);
    if (value.Tag !== void 0)
      return visitor.Tag(value.Tag);
    if (value.ObjectSizeGreaterThan !== void 0)
      return visitor.ObjectSizeGreaterThan(value.ObjectSizeGreaterThan);
    if (value.ObjectSizeLessThan !== void 0)
      return visitor.ObjectSizeLessThan(value.ObjectSizeLessThan);
    if (value.And !== void 0)
      return visitor.And(value.And);
    return visitor._(value.$unknown[0], value.$unknown[1]);
  };
})(LifecycleRuleFilter || (LifecycleRuleFilter = {}));
var MetricsFilter;
(function(MetricsFilter2) {
  MetricsFilter2.visit = (value, visitor) => {
    if (value.Prefix !== void 0)
      return visitor.Prefix(value.Prefix);
    if (value.Tag !== void 0)
      return visitor.Tag(value.Tag);
    if (value.AccessPointArn !== void 0)
      return visitor.AccessPointArn(value.AccessPointArn);
    if (value.And !== void 0)
      return visitor.And(value.And);
    return visitor._(value.$unknown[0], value.$unknown[1]);
  };
})(MetricsFilter || (MetricsFilter = {}));
var ReplicationRuleFilter;
(function(ReplicationRuleFilter2) {
  ReplicationRuleFilter2.visit = (value, visitor) => {
    if (value.Prefix !== void 0)
      return visitor.Prefix(value.Prefix);
    if (value.Tag !== void 0)
      return visitor.Tag(value.Tag);
    if (value.And !== void 0)
      return visitor.And(value.And);
    return visitor._(value.$unknown[0], value.$unknown[1]);
  };
})(ReplicationRuleFilter || (ReplicationRuleFilter = {}));
var PutObjectOutputFilterSensitiveLog = (obj) => ({
  ...obj,
  ...obj.SSEKMSKeyId && { SSEKMSKeyId: SENSITIVE_STRING },
  ...obj.SSEKMSEncryptionContext && { SSEKMSEncryptionContext: SENSITIVE_STRING }
});
var PutObjectRequestFilterSensitiveLog = (obj) => ({
  ...obj,
  ...obj.SSECustomerKey && { SSECustomerKey: SENSITIVE_STRING },
  ...obj.SSEKMSKeyId && { SSEKMSKeyId: SENSITIVE_STRING },
  ...obj.SSEKMSEncryptionContext && { SSEKMSEncryptionContext: SENSITIVE_STRING }
});

// node_modules/.pnpm/@aws-sdk+client-s3@3.409.0/node_modules/@aws-sdk/client-s3/dist-es/protocols/Aws_restXml.js
var se_PutObjectCommand = async (input, context) => {
  const { hostname, protocol = "https", port, path: basePath } = await context.endpoint();
  const headers = map({}, isSerializableHeaderValue2, {
    "content-type": input.ContentType || "application/octet-stream",
    "x-amz-acl": input.ACL,
    "cache-control": input.CacheControl,
    "content-disposition": input.ContentDisposition,
    "content-encoding": input.ContentEncoding,
    "content-language": input.ContentLanguage,
    "content-length": [() => isSerializableHeaderValue2(input.ContentLength), () => input.ContentLength.toString()],
    "content-md5": input.ContentMD5,
    "x-amz-sdk-checksum-algorithm": input.ChecksumAlgorithm,
    "x-amz-checksum-crc32": input.ChecksumCRC32,
    "x-amz-checksum-crc32c": input.ChecksumCRC32C,
    "x-amz-checksum-sha1": input.ChecksumSHA1,
    "x-amz-checksum-sha256": input.ChecksumSHA256,
    expires: [() => isSerializableHeaderValue2(input.Expires), () => dateToUtcString(input.Expires).toString()],
    "x-amz-grant-full-control": input.GrantFullControl,
    "x-amz-grant-read": input.GrantRead,
    "x-amz-grant-read-acp": input.GrantReadACP,
    "x-amz-grant-write-acp": input.GrantWriteACP,
    "x-amz-server-side-encryption": input.ServerSideEncryption,
    "x-amz-storage-class": input.StorageClass,
    "x-amz-website-redirect-location": input.WebsiteRedirectLocation,
    "x-amz-server-side-encryption-customer-algorithm": input.SSECustomerAlgorithm,
    "x-amz-server-side-encryption-customer-key": input.SSECustomerKey,
    "x-amz-server-side-encryption-customer-key-md5": input.SSECustomerKeyMD5,
    "x-amz-server-side-encryption-aws-kms-key-id": input.SSEKMSKeyId,
    "x-amz-server-side-encryption-context": input.SSEKMSEncryptionContext,
    "x-amz-server-side-encryption-bucket-key-enabled": [
      () => isSerializableHeaderValue2(input.BucketKeyEnabled),
      () => input.BucketKeyEnabled.toString()
    ],
    "x-amz-request-payer": input.RequestPayer,
    "x-amz-tagging": input.Tagging,
    "x-amz-object-lock-mode": input.ObjectLockMode,
    "x-amz-object-lock-retain-until-date": [
      () => isSerializableHeaderValue2(input.ObjectLockRetainUntilDate),
      () => (input.ObjectLockRetainUntilDate.toISOString().split(".")[0] + "Z").toString()
    ],
    "x-amz-object-lock-legal-hold": input.ObjectLockLegalHoldStatus,
    "x-amz-expected-bucket-owner": input.ExpectedBucketOwner,
    ...input.Metadata !== void 0 && Object.keys(input.Metadata).reduce((acc, suffix) => {
      acc[`x-amz-meta-${suffix.toLowerCase()}`] = input.Metadata[suffix];
      return acc;
    }, {})
  });
  let resolvedPath2 = `${(basePath == null ? void 0 : basePath.endsWith("/")) ? basePath.slice(0, -1) : basePath || ""}/{Key+}`;
  resolvedPath2 = resolvedPath(resolvedPath2, input, "Bucket", () => input.Bucket, "{Bucket}", false);
  resolvedPath2 = resolvedPath(resolvedPath2, input, "Key", () => input.Key, "{Key+}", true);
  const query = map({
    "x-id": [, "PutObject"]
  });
  let body;
  if (input.Body !== void 0) {
    body = input.Body;
  }
  let contents;
  if (input.Body !== void 0) {
    contents = input.Body;
    body = contents;
  }
  return new HttpRequest({
    protocol,
    hostname,
    port,
    method: "PUT",
    headers,
    path: resolvedPath2,
    query,
    body
  });
};
var de_PutObjectCommand = async (output, context) => {
  if (output.statusCode !== 200 && output.statusCode >= 300) {
    return de_PutObjectCommandError(output, context);
  }
  const contents = map({
    $metadata: deserializeMetadata5(output),
    Expiration: [, output.headers["x-amz-expiration"]],
    ETag: [, output.headers["etag"]],
    ChecksumCRC32: [, output.headers["x-amz-checksum-crc32"]],
    ChecksumCRC32C: [, output.headers["x-amz-checksum-crc32c"]],
    ChecksumSHA1: [, output.headers["x-amz-checksum-sha1"]],
    ChecksumSHA256: [, output.headers["x-amz-checksum-sha256"]],
    ServerSideEncryption: [, output.headers["x-amz-server-side-encryption"]],
    VersionId: [, output.headers["x-amz-version-id"]],
    SSECustomerAlgorithm: [, output.headers["x-amz-server-side-encryption-customer-algorithm"]],
    SSECustomerKeyMD5: [, output.headers["x-amz-server-side-encryption-customer-key-md5"]],
    SSEKMSKeyId: [, output.headers["x-amz-server-side-encryption-aws-kms-key-id"]],
    SSEKMSEncryptionContext: [, output.headers["x-amz-server-side-encryption-context"]],
    BucketKeyEnabled: [
      () => void 0 !== output.headers["x-amz-server-side-encryption-bucket-key-enabled"],
      () => parseBoolean(output.headers["x-amz-server-side-encryption-bucket-key-enabled"])
    ],
    RequestCharged: [, output.headers["x-amz-request-charged"]]
  });
  await collectBody(output.body, context);
  return contents;
};
var de_PutObjectCommandError = async (output, context) => {
  const parsedOutput = {
    ...output,
    body: await parseErrorBody4(output.body, context)
  };
  const errorCode = loadRestXmlErrorCode(output, parsedOutput.body);
  const parsedBody = parsedOutput.body;
  return throwDefaultError5({
    output,
    parsedBody,
    errorCode
  });
};
var throwDefaultError5 = withBaseException(S3ServiceException);
var deserializeMetadata5 = (output) => {
  var _a, _b;
  return {
    httpStatusCode: output.statusCode,
    requestId: (_b = (_a = output.headers["x-amzn-requestid"]) != null ? _a : output.headers["x-amzn-request-id"]) != null ? _b : output.headers["x-amz-request-id"],
    extendedRequestId: output.headers["x-amz-id-2"],
    cfId: output.headers["x-amz-cf-id"]
  };
};
var collectBodyString4 = (streamBody, context) => collectBody(streamBody, context).then((body) => context.utf8Encoder(body));
var isSerializableHeaderValue2 = (value) => value !== void 0 && value !== null && value !== "" && (!Object.getOwnPropertyNames(value).includes("length") || value.length != 0) && (!Object.getOwnPropertyNames(value).includes("size") || value.size != 0);
var parseBody4 = (streamBody, context) => collectBodyString4(streamBody, context).then((encoded) => {
  if (encoded.length) {
    const parser = new import_fast_xml_parser2.XMLParser({
      attributeNamePrefix: "",
      htmlEntities: true,
      ignoreAttributes: false,
      ignoreDeclaration: true,
      parseTagValue: false,
      trimValues: false,
      tagValueProcessor: (_, val2) => val2.trim() === "" && val2.includes("\n") ? "" : void 0
    });
    parser.addEntity("#xD", "\r");
    parser.addEntity("#10", "\n");
    const parsedObj = parser.parse(encoded);
    const textNodeName = "#text";
    const key = Object.keys(parsedObj)[0];
    const parsedObjToReturn = parsedObj[key];
    if (parsedObjToReturn[textNodeName]) {
      parsedObjToReturn[key] = parsedObjToReturn[textNodeName];
      delete parsedObjToReturn[textNodeName];
    }
    return getValueFromTextNode(parsedObjToReturn);
  }
  return {};
});
var parseErrorBody4 = async (errorBody, context) => {
  var _a;
  const value = await parseBody4(errorBody, context);
  if (value.Error) {
    value.Error.message = (_a = value.Error.message) != null ? _a : value.Error.Message;
  }
  return value;
};
var loadRestXmlErrorCode = (output, data) => {
  if ((data == null ? void 0 : data.Code) !== void 0) {
    return data.Code;
  }
  if (output.statusCode == 404) {
    return "NotFound";
  }
};

// node_modules/.pnpm/@aws-sdk+middleware-ssec@3.408.0/node_modules/@aws-sdk/middleware-ssec/dist-es/index.js
function ssecMiddleware(options) {
  return (next) => async (args) => {
    let input = { ...args.input };
    const properties = [
      {
        target: "SSECustomerKey",
        hash: "SSECustomerKeyMD5"
      },
      {
        target: "CopySourceSSECustomerKey",
        hash: "CopySourceSSECustomerKeyMD5"
      }
    ];
    for (const prop of properties) {
      const value = input[prop.target];
      if (value) {
        const valueView = ArrayBuffer.isView(value) ? new Uint8Array(value.buffer, value.byteOffset, value.byteLength) : typeof value === "string" ? options.utf8Decoder(value) : new Uint8Array(value);
        const encoded = options.base64Encoder(valueView);
        const hash = new options.md5();
        hash.update(valueView);
        input = {
          ...input,
          [prop.target]: encoded,
          [prop.hash]: options.base64Encoder(await hash.digest())
        };
      }
    }
    return next({
      ...args,
      input
    });
  };
}
var ssecMiddlewareOptions = {
  name: "ssecMiddleware",
  step: "initialize",
  tags: ["SSE"],
  override: true
};
var getSsecPlugin = (config) => ({
  applyToStack: (clientStack) => {
    clientStack.add(ssecMiddleware(config), ssecMiddlewareOptions);
  }
});

// node_modules/.pnpm/@aws-sdk+middleware-flexible-checksums@3.408.0/node_modules/@aws-sdk/middleware-flexible-checksums/dist-es/constants.js
var ChecksumAlgorithm;
(function(ChecksumAlgorithm2) {
  ChecksumAlgorithm2["MD5"] = "MD5";
  ChecksumAlgorithm2["CRC32"] = "CRC32";
  ChecksumAlgorithm2["CRC32C"] = "CRC32C";
  ChecksumAlgorithm2["SHA1"] = "SHA1";
  ChecksumAlgorithm2["SHA256"] = "SHA256";
})(ChecksumAlgorithm || (ChecksumAlgorithm = {}));
var ChecksumLocation;
(function(ChecksumLocation2) {
  ChecksumLocation2["HEADER"] = "header";
  ChecksumLocation2["TRAILER"] = "trailer";
})(ChecksumLocation || (ChecksumLocation = {}));

// node_modules/.pnpm/@aws-sdk+middleware-flexible-checksums@3.408.0/node_modules/@aws-sdk/middleware-flexible-checksums/dist-es/types.js
var CLIENT_SUPPORTED_ALGORITHMS = [
  ChecksumAlgorithm.CRC32,
  ChecksumAlgorithm.CRC32C,
  ChecksumAlgorithm.SHA1,
  ChecksumAlgorithm.SHA256
];
var PRIORITY_ORDER_ALGORITHMS = [
  ChecksumAlgorithm.CRC32,
  ChecksumAlgorithm.CRC32C,
  ChecksumAlgorithm.SHA1,
  ChecksumAlgorithm.SHA256
];

// node_modules/.pnpm/@aws-sdk+middleware-flexible-checksums@3.408.0/node_modules/@aws-sdk/middleware-flexible-checksums/dist-es/getChecksumAlgorithmForRequest.js
var getChecksumAlgorithmForRequest = (input, { requestChecksumRequired, requestAlgorithmMember }) => {
  if (!requestAlgorithmMember || !input[requestAlgorithmMember]) {
    return requestChecksumRequired ? ChecksumAlgorithm.MD5 : void 0;
  }
  const checksumAlgorithm = input[requestAlgorithmMember];
  if (!CLIENT_SUPPORTED_ALGORITHMS.includes(checksumAlgorithm)) {
    throw new Error(`The checksum algorithm "${checksumAlgorithm}" is not supported by the client. Select one of ${CLIENT_SUPPORTED_ALGORITHMS}.`);
  }
  return checksumAlgorithm;
};

// node_modules/.pnpm/@aws-sdk+middleware-flexible-checksums@3.408.0/node_modules/@aws-sdk/middleware-flexible-checksums/dist-es/getChecksumLocationName.js
var getChecksumLocationName = (algorithm) => algorithm === ChecksumAlgorithm.MD5 ? "content-md5" : `x-amz-checksum-${algorithm.toLowerCase()}`;

// node_modules/.pnpm/@aws-sdk+middleware-flexible-checksums@3.408.0/node_modules/@aws-sdk/middleware-flexible-checksums/dist-es/hasHeader.js
var hasHeader2 = (header, headers) => {
  const soughtHeader = header.toLowerCase();
  for (const headerName of Object.keys(headers)) {
    if (soughtHeader === headerName.toLowerCase()) {
      return true;
    }
  }
  return false;
};

// node_modules/.pnpm/@aws-sdk+middleware-flexible-checksums@3.408.0/node_modules/@aws-sdk/middleware-flexible-checksums/dist-es/isStreaming.js
var isStreaming = (body) => body !== void 0 && typeof body !== "string" && !ArrayBuffer.isView(body) && !isArrayBuffer(body);

// node_modules/.pnpm/@aws-sdk+middleware-flexible-checksums@3.408.0/node_modules/@aws-sdk/middleware-flexible-checksums/dist-es/selectChecksumAlgorithmFunction.js
var import_crc323 = __toESM(require_build2());
var import_crc32c = __toESM(require_build3());
var selectChecksumAlgorithmFunction = (checksumAlgorithm, config) => ({
  [ChecksumAlgorithm.MD5]: config.md5,
  [ChecksumAlgorithm.CRC32]: import_crc323.AwsCrc32,
  [ChecksumAlgorithm.CRC32C]: import_crc32c.AwsCrc32c,
  [ChecksumAlgorithm.SHA1]: config.sha1,
  [ChecksumAlgorithm.SHA256]: config.sha256
})[checksumAlgorithm];

// node_modules/.pnpm/@aws-sdk+middleware-flexible-checksums@3.408.0/node_modules/@aws-sdk/middleware-flexible-checksums/dist-es/stringHasher.js
var stringHasher = (checksumAlgorithmFn, body) => {
  const hash = new checksumAlgorithmFn();
  hash.update(toUint8Array(body || ""));
  return hash.digest();
};

// node_modules/.pnpm/@aws-sdk+middleware-flexible-checksums@3.408.0/node_modules/@aws-sdk/middleware-flexible-checksums/dist-es/flexibleChecksumsMiddleware.js
var flexibleChecksumsMiddleware = (config, middlewareConfig) => (next) => async (args) => {
  if (!HttpRequest.isInstance(args.request)) {
    return next(args);
  }
  const { request: request2 } = args;
  const { body: requestBody, headers } = request2;
  const { base64Encoder, streamHasher } = config;
  const { input, requestChecksumRequired, requestAlgorithmMember } = middlewareConfig;
  const checksumAlgorithm = getChecksumAlgorithmForRequest(input, {
    requestChecksumRequired,
    requestAlgorithmMember
  });
  let updatedBody = requestBody;
  let updatedHeaders = headers;
  if (checksumAlgorithm) {
    const checksumLocationName = getChecksumLocationName(checksumAlgorithm);
    const checksumAlgorithmFn = selectChecksumAlgorithmFunction(checksumAlgorithm, config);
    if (isStreaming(requestBody)) {
      const { getAwsChunkedEncodingStream: getAwsChunkedEncodingStream2, bodyLengthChecker } = config;
      updatedBody = getAwsChunkedEncodingStream2(requestBody, {
        base64Encoder,
        bodyLengthChecker,
        checksumLocationName,
        checksumAlgorithmFn,
        streamHasher
      });
      updatedHeaders = {
        ...headers,
        "content-encoding": headers["content-encoding"] ? `${headers["content-encoding"]},aws-chunked` : "aws-chunked",
        "transfer-encoding": "chunked",
        "x-amz-decoded-content-length": headers["content-length"],
        "x-amz-content-sha256": "STREAMING-UNSIGNED-PAYLOAD-TRAILER",
        "x-amz-trailer": checksumLocationName
      };
      delete updatedHeaders["content-length"];
    } else if (!hasHeader2(checksumLocationName, headers)) {
      const rawChecksum = await stringHasher(checksumAlgorithmFn, requestBody);
      updatedHeaders = {
        ...headers,
        [checksumLocationName]: base64Encoder(rawChecksum)
      };
    }
  }
  const result = await next({
    ...args,
    request: {
      ...request2,
      headers: updatedHeaders,
      body: updatedBody
    }
  });
  return result;
};

// node_modules/.pnpm/@aws-sdk+middleware-flexible-checksums@3.408.0/node_modules/@aws-sdk/middleware-flexible-checksums/dist-es/streams/create-read-stream-on-buffer.js
var import_stream7 = require("stream");
function createReadStreamOnBuffer(buffer) {
  const stream = new import_stream7.Transform();
  stream.push(buffer);
  stream.push(null);
  return stream;
}

// node_modules/.pnpm/@aws-sdk+middleware-flexible-checksums@3.408.0/node_modules/@aws-sdk/middleware-flexible-checksums/dist-es/getChecksum.js
var getChecksum = async (body, { streamHasher, checksumAlgorithmFn, base64Encoder }) => {
  const digest = isStreaming(body) ? streamHasher(checksumAlgorithmFn, body) : stringHasher(checksumAlgorithmFn, body);
  return base64Encoder(await digest);
};

// node_modules/.pnpm/@aws-sdk+middleware-flexible-checksums@3.408.0/node_modules/@aws-sdk/middleware-flexible-checksums/dist-es/getChecksumAlgorithmListForResponse.js
var getChecksumAlgorithmListForResponse = (responseAlgorithms = []) => {
  const validChecksumAlgorithms = [];
  for (const algorithm of PRIORITY_ORDER_ALGORITHMS) {
    if (!responseAlgorithms.includes(algorithm) || !CLIENT_SUPPORTED_ALGORITHMS.includes(algorithm)) {
      continue;
    }
    validChecksumAlgorithms.push(algorithm);
  }
  return validChecksumAlgorithms;
};

// node_modules/.pnpm/@aws-sdk+middleware-flexible-checksums@3.408.0/node_modules/@aws-sdk/middleware-flexible-checksums/dist-es/validateChecksumFromResponse.js
var validateChecksumFromResponse = async (response, { config, responseAlgorithms }) => {
  const checksumAlgorithms = getChecksumAlgorithmListForResponse(responseAlgorithms);
  const { body: responseBody, headers: responseHeaders } = response;
  for (const algorithm of checksumAlgorithms) {
    const responseHeader = getChecksumLocationName(algorithm);
    const checksumFromResponse = responseHeaders[responseHeader];
    if (checksumFromResponse) {
      const checksumAlgorithmFn = selectChecksumAlgorithmFunction(algorithm, config);
      const { streamHasher, base64Encoder } = config;
      const checksum = await getChecksum(responseBody, { streamHasher, checksumAlgorithmFn, base64Encoder });
      if (checksum === checksumFromResponse) {
        break;
      }
      throw new Error(`Checksum mismatch: expected "${checksum}" but received "${checksumFromResponse}" in response header "${responseHeader}".`);
    }
  }
};

// node_modules/.pnpm/@aws-sdk+middleware-flexible-checksums@3.408.0/node_modules/@aws-sdk/middleware-flexible-checksums/dist-es/flexibleChecksumsResponseMiddleware.js
var flexibleChecksumsResponseMiddlewareOptions = {
  name: "flexibleChecksumsResponseMiddleware",
  toMiddleware: "deserializerMiddleware",
  relation: "after",
  tags: ["BODY_CHECKSUM"],
  override: true
};
var flexibleChecksumsResponseMiddleware = (config, middlewareConfig) => (next) => async (args) => {
  if (!HttpRequest.isInstance(args.request)) {
    return next(args);
  }
  const input = args.input;
  const result = await next(args);
  const response = result.response;
  let collectedStream = void 0;
  const { requestValidationModeMember, responseAlgorithms } = middlewareConfig;
  if (requestValidationModeMember && input[requestValidationModeMember] === "ENABLED") {
    const isStreamingBody = isStreaming(response.body);
    if (isStreamingBody) {
      collectedStream = await config.streamCollector(response.body);
      response.body = createReadStreamOnBuffer(collectedStream);
    }
    await validateChecksumFromResponse(result.response, {
      config,
      responseAlgorithms
    });
    if (isStreamingBody && collectedStream) {
      response.body = createReadStreamOnBuffer(collectedStream);
    }
  }
  return result;
};

// node_modules/.pnpm/@aws-sdk+middleware-flexible-checksums@3.408.0/node_modules/@aws-sdk/middleware-flexible-checksums/dist-es/getFlexibleChecksumsPlugin.js
var flexibleChecksumsMiddlewareOptions = {
  name: "flexibleChecksumsMiddleware",
  step: "build",
  tags: ["BODY_CHECKSUM"],
  override: true
};
var getFlexibleChecksumsPlugin = (config, middlewareConfig) => ({
  applyToStack: (clientStack) => {
    clientStack.add(flexibleChecksumsMiddleware(config, middlewareConfig), flexibleChecksumsMiddlewareOptions);
    clientStack.addRelativeTo(flexibleChecksumsResponseMiddleware(config, middlewareConfig), flexibleChecksumsResponseMiddlewareOptions);
  }
});

// node_modules/.pnpm/@aws-sdk+client-s3@3.409.0/node_modules/@aws-sdk/client-s3/dist-es/commands/PutObjectCommand.js
var PutObjectCommand = class _PutObjectCommand extends Command {
  static getEndpointParameterInstructions() {
    return {
      Bucket: { type: "contextParams", name: "Bucket" },
      ForcePathStyle: { type: "clientContextParams", name: "forcePathStyle" },
      UseArnRegion: { type: "clientContextParams", name: "useArnRegion" },
      DisableMultiRegionAccessPoints: { type: "clientContextParams", name: "disableMultiregionAccessPoints" },
      Accelerate: { type: "clientContextParams", name: "useAccelerateEndpoint" },
      UseGlobalEndpoint: { type: "builtInParams", name: "useGlobalEndpoint" },
      UseFIPS: { type: "builtInParams", name: "useFipsEndpoint" },
      Endpoint: { type: "builtInParams", name: "endpoint" },
      Region: { type: "builtInParams", name: "region" },
      UseDualStack: { type: "builtInParams", name: "useDualstackEndpoint" }
    };
  }
  constructor(input) {
    super();
    this.input = input;
  }
  resolveMiddleware(clientStack, configuration, options) {
    this.middlewareStack.use(getSerdePlugin(configuration, this.serialize, this.deserialize));
    this.middlewareStack.use(getEndpointPlugin(configuration, _PutObjectCommand.getEndpointParameterInstructions()));
    this.middlewareStack.use(getCheckContentLengthHeaderPlugin(configuration));
    this.middlewareStack.use(getSsecPlugin(configuration));
    this.middlewareStack.use(getFlexibleChecksumsPlugin(configuration, {
      input: this.input,
      requestAlgorithmMember: "ChecksumAlgorithm",
      requestChecksumRequired: false
    }));
    const stack = clientStack.concat(this.middlewareStack);
    const { logger: logger2 } = configuration;
    const clientName = "S3Client";
    const commandName = "PutObjectCommand";
    const handlerExecutionContext = {
      logger: logger2,
      clientName,
      commandName,
      inputFilterSensitiveLog: PutObjectRequestFilterSensitiveLog,
      outputFilterSensitiveLog: PutObjectOutputFilterSensitiveLog
    };
    const { requestHandler } = configuration;
    return stack.resolve((request2) => requestHandler.handle(request2.request, options || {}), handlerExecutionContext);
  }
  serialize(input, context) {
    return se_PutObjectCommand(input, context);
  }
  deserialize(output, context) {
    return de_PutObjectCommand(output, context);
  }
};

// src/r2Client.ts
var R2 = new S3Client({
  region: "auto",
  endpoint: `https://${process.env.CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY
  }
});
var putObject = async (Key, Body, ContentType) => {
  const command = new PutObjectCommand({
    Bucket: process.env.R2_BUCKET,
    Key,
    Body,
    ContentType
  });
  const result = await R2.send(command);
  return result;
};

// src/main.ts
var import_fs6 = require("fs");
var main = async () => {
  const { filename, location, result } = await captureImage();
  const uploadResult = await putObject(`images/${filename}`, result, "image/jpeg");
  console.log(uploadResult);
  (0, import_fs6.unlinkSync)(location);
};
main();
/*! Bundled license information:

tslib/tslib.es6.js:
  (*! *****************************************************************************
  Copyright (c) Microsoft Corporation.
  
  Permission to use, copy, modify, and/or distribute this software for any
  purpose with or without fee is hereby granted.
  
  THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
  REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
  AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
  INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
  LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
  OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
  PERFORMANCE OF THIS SOFTWARE.
  ***************************************************************************** *)
*/
//# sourceMappingURL=main.js.map