var CORE_MODULES = [
    // Core JS modules.
    // Will tell Gulp which modules to pull into marketplace-core-modules/.
    // Will tell the require.js config which files live in marketplace-core-modules/.
    'assert',
    'buckets',
    'builder',
    'cache',
    'capabilities',
    'defer',
    'forms',
    'format',
    'helpers',
    'l10n',
    'log',
    'login',
    'models',
    'navigation',
    'notification',
    'nunjucks',
    'nunjucks.compat',
    'polyfill',
    'requests',
    'site_config',
    'storage',
    'urls',
    'user',
    'utils',
    'views',
    'z'
];

var CORE_MODULES_ROOT_JS = [
    // Core modules that traditionally live in the root JS path.
    'l10n',
    'views'
];

var CORE_VIEWS = [
    'views/fxa_authorize',
    'views/not_found',
    'views/tests'
];

var BASE_PATH = 'src/media/';
var CORE_SRC_PATH = 'marketplace-core-modules/';
var CORE_TEMPLATE_PATH = 'commonplace/dist/core-templates/';
var JS_DEST_PATH = BASE_PATH + 'js/';
var LIB_DEST_PATH = JS_DEST_PATH + 'lib/';
var CORE_DEST_PATH = LIB_DEST_PATH + 'marketplace-core-modules/';
var CSS_DEST_PATH = BASE_PATH + 'css/';

// Build config object to tell Gulp which Bower files into project and where.
var bowerConfig = {
    'almond/almond.js': LIB_DEST_PATH,
    'jquery/jquery.js': LIB_DEST_PATH,
    // TODO: Use the official nunjucks and not a modified one.
    // 'nunjucks/browser/nunjucks-slim.js': LIB_DEST_PATH,
    'underscore/underscore.js': LIB_DEST_PATH,
    'marketplace-core-modules/tests/**/*.js': CORE_DEST_PATH + 'tests',
    'marketplace-core-modules/tests/tests.html': 'src/templates/commonplace/'
};
CORE_MODULES.forEach(function(module) {
    if (CORE_MODULES_ROOT_JS.indexOf(module) !== -1) {
        // Modules that go into the root JS path (for some reason).
        bowerConfig[CORE_SRC_PATH + module + '.js'] = JS_DEST_PATH;
        return;
    }
    bowerConfig[CORE_SRC_PATH + module + '.js'] = CORE_DEST_PATH;
});
CORE_VIEWS.forEach(function(view) {
    bowerConfig[CORE_SRC_PATH + view + '.js'] = CORE_DEST_PATH + 'views/';
});

// Build require config, to be used in development and AMD optimizers.
var requireConfig = {
    enforceDefine: true,
    paths: {
        'jquery': 'lib/jquery',
        // 'nunjucks': 'lib/nunjucks-slim',
        'templates': '../../templates',
        'underscore': 'lib/underscore',
        'views/not_found': 'lib/marketplace-core-modules/views/not_found',
        'views/tests': 'lib/marketplace-core-modules/views/tests',
    },
    shim: {
        'underscore': {
            'exports': '_'
        },
    }
};
CORE_MODULES.forEach(function(module) {
    if (CORE_MODULES_ROOT_JS.indexOf(module) !== -1) {
        return;
    }
    requireConfig.paths[module] = 'lib/marketplace-core-modules/' + module;
});
CORE_VIEWS.forEach(function(view) {
    requireConfig.paths[view] = 'lib/marketplace-core-modules/' + view;
});

var BOWER_PATH = process.env.BOWER_PATH || './bower_components/';

// Server config to allow easy switching of servers in settings.
var serverConfig = {
    prod: {
        api_url: 'https://marketplace.firefox.com',
        media_url: 'https://marketplace.cdn.mozilla.net/media/',
    },
    dev: {
        api_url: 'https://marketplace-dev.allizom.org',
        media_url: 'https://marketplace-dev.mozflare.net/media/',
    },
    stage: {
        api_url: 'https://marketplace.allizom.org',
        media_url: 'https://marketplace-stage.cdn.mozilla.net/media/',
    },
    altdev: {
        api_url: 'https://marketplace-altdev.allizom.org',
        media_url: 'https://marketplace-altdev-cdn.allizom.org/media/',
    },
    paymentsalt: {
        api_url: 'https://payments-alt.allizom.org',
        media_url: 'https://payments-alt-cdn.allizom.org/media/',
    },
    localhost: {
        api_url: 'http://localhost',
        media_url: 'http://localhost',
    },
    mpdev: {
        api_url: 'http://mp.dev',
        media_url: 'http://mp.dev/media/',
    },
    mock: {
        api_url: 'https://flue.paas.allizom.org',
        media_url: 'https://flue.paas.allizom.org',
    },
    mocklocal: {
        api_url: 'http://localhost:5000',
        media_url: 'http://localhost:5000',
    },
};

module.exports = {
    bowerConfig: bowerConfig,
    requireConfig: requireConfig,
    serverConfig: serverConfig,
    BOWER_PATH: BOWER_PATH,
    CSS_DEST_PATH: CSS_DEST_PATH,
    JS_DEST_PATH: JS_DEST_PATH,
    LIB_DEST_PATH: LIB_DEST_PATH,
    makeInlineRequireConfig: function(requireConfig) {
        return '(function() {' +
            'require.config(' +
                JSON.stringify(requireConfig) +
            ');' +
        '}())';
    }
};
