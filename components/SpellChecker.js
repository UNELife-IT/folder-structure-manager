export default class SpellChecker {
  constructor() {
    this.issueId = 0;

    // Common misspellings dictionary (comprehensive)
    this.misspellings = {
      'accesories': 'accessories', 'accomodate': 'accommodate', 'acheive': 'achieve',
      'acknowlege': 'acknowledge', 'adress': 'address', 'advertisment': 'advertisement',
      'agressive': 'aggressive', 'aledge': 'allege', 'amature': 'amateur',
      'aparent': 'apparent', 'arguement': 'argument', 'assasination': 'assassination',
      'assest': 'asset', 'assests': 'assets', 'asign': 'assign', 'asignment': 'assignment',
      'athiest': 'atheist', 'auther': 'author', 'authers': 'authors',
      'bakcup': 'backup', 'backgorund': 'background', 'begining': 'beginning',
      'beleive': 'believe', 'buisness': 'business', 'buisiness': 'business',
      'calender': 'calendar', 'catagory': 'category', 'catagories': 'categories',
      'changable': 'changeable', 'cheif': 'chief', 'colection': 'collection',
      'collegue': 'colleague', 'comming': 'coming', 'commited': 'committed',
      'commitee': 'committee', 'comparision': 'comparison', 'compatable': 'compatible',
      'completly': 'completely', 'concious': 'conscious', 'congradulations': 'congratulations',
      'connnection': 'connection', 'connexion': 'connection', 'consistant': 'consistent',
      'controll': 'control', 'controler': 'controller', 'convienient': 'convenient',
      'copywrite': 'copyright', 'corosion': 'corrosion', 'critisism': 'criticism',
      'curiousity': 'curiosity', 'currenly': 'currently', 'custmer': 'customer',
      'databse': 'database', 'databaes': 'database', 'decison': 'decision',
      'definate': 'definite', 'definately': 'definitely', 'definitly': 'definitely',
      'dependant': 'dependent', 'desgin': 'design', 'develope': 'develop',
      'developement': 'development', 'devlopment': 'development', 'diferent': 'different',
      'diffrent': 'different', 'dilema': 'dilemma', 'disapear': 'disappear',
      'disapoint': 'disappoint', 'documnet': 'document', 'docuemnt': 'document',
      'documennts': 'documents', 'dosent': 'doesnt', 'donwload': 'download',
      'dowload': 'download', 'dupicate': 'duplicate',
      'embarass': 'embarrass', 'enviroment': 'environment', 'enviorment': 'environment',
      'equipement': 'equipment', 'equiptment': 'equipment', 'essense': 'essence',
      'exagerate': 'exaggerate', 'excercise': 'exercise', 'existance': 'existence',
      'expereince': 'experience', 'experiance': 'experience', 'explaination': 'explanation',
      'facillity': 'facility', 'familar': 'familiar', 'favourate': 'favourite',
      'feasability': 'feasibility', 'Febuary': 'February', 'fiels': 'files',
      'finaly': 'finally', 'flourescent': 'fluorescent', 'foriegn': 'foreign',
      'fourty': 'forty', 'freind': 'friend', 'fulfil': 'fulfill',
      'goverment': 'government', 'gaurd': 'guard', 'guidence': 'guidance',
      'happend': 'happened', 'harrass': 'harass', 'heirarchy': 'hierarchy',
      'hiearchy': 'hierarchy', 'hygeine': 'hygiene',
      'ignorence': 'ignorance', 'imediate': 'immediate', 'immediatly': 'immediately',
      'incidently': 'incidentally', 'independant': 'independent', 'indispensible': 'indispensable',
      'infomation': 'information', 'infrastucture': 'infrastructure', 'inheritence': 'inheritance',
      'initalize': 'initialize', 'innoculate': 'inoculate', 'instalation': 'installation',
      'inteligence': 'intelligence', 'interfer': 'interfere', 'intresting': 'interesting',
      'iresistible': 'irresistible', 'isnt': 'isnt',
      'javacsript': 'javascript', 'javascrpt': 'javascript', 'javscript': 'javascript',
      'jewlery': 'jewelry', 'judgement': 'judgment',
      'kernal': 'kernel', 'knowlege': 'knowledge', 'knowlede': 'knowledge',
      'langauge': 'language', 'lenght': 'length', 'liason': 'liaison',
      'libary': 'library', 'libraray': 'library', 'licesne': 'license',
      'lightening': 'lightning', 'loggin': 'logging',
      'maintenace': 'maintenance', 'maintainance': 'maintenance', 'managment': 'management',
      'managament': 'management', 'manger': 'manager', 'mannager': 'manager',
      'manualy': 'manually', 'medival': 'medieval', 'millenium': 'millennium',
      'minature': 'miniature', 'mininum': 'minimum', 'mispell': 'misspell',
      'moduel': 'module', 'modle': 'model', 'moniter': 'monitor',
      'naturaly': 'naturally', 'neccessary': 'necessary', 'necessery': 'necessary',
      'negociate': 'negotiate', 'nieghbor': 'neighbor', 'noticable': 'noticeable',
      'occassion': 'occasion', 'occured': 'occurred', 'occurence': 'occurrence',
      'offical': 'official', 'omision': 'omission', 'opertaion': 'operation',
      'oportunity': 'opportunity', 'optimze': 'optimize', 'orginal': 'original',
      'ouput': 'output', 'overide': 'override',
      'pacakge': 'package', 'paralel': 'parallel', 'parliment': 'parliament',
      'particulary': 'particularly', 'passtime': 'pastime', 'pateint': 'patient',
      'percieve': 'perceive', 'performace': 'performance', 'peice': 'piece',
      'personel': 'personnel', 'persue': 'pursue', 'planing': 'planning',
      'playwrite': 'playwright', 'posession': 'possession', 'potatos': 'potatoes',
      'practise': 'practice', 'preceed': 'precede', 'prefered': 'preferred',
      'preformance': 'performance', 'presance': 'presence', 'privelege': 'privilege',
      'probaly': 'probably', 'proccess': 'process', 'profesional': 'professional',
      'programing': 'programming', 'propogate': 'propagate', 'prupose': 'purpose',
      'publically': 'publicly', 'purchse': 'purchase',
      'questionaire': 'questionnaire', 'que': 'queue',
      'realy': 'really', 'reccomend': 'recommend', 'recieve': 'receive',
      'recievables': 'receivables', 'recognise': 'recognize', 'recomend': 'recommend',
      'refrence': 'reference', 'referance': 'reference', 'relevent': 'relevant',
      'religous': 'religious', 'repitition': 'repetition', 'reponse': 'response',
      'repositry': 'repository', 'requirment': 'requirement', 'resourse': 'resource',
      'resorces': 'resources', 'resposible': 'responsible', 'restraunt': 'restaurant',
      'rythm': 'rhythm',
      'safty': 'safety', 'scedule': 'schedule', 'shedule': 'schedule',
      'seize': 'seize', 'sentance': 'sentence', 'seperate': 'separate',
      'sergant': 'sergeant', 'servise': 'service', 'sevral': 'several',
      'similiar': 'similar', 'sinceerly': 'sincerely', 'speach': 'speech',
      'statment': 'statement', 'stragety': 'strategy', 'strenght': 'strength',
      'strucutre': 'structure', 'sturcture': 'structure', 'succesful': 'successful',
      'successfull': 'successful', 'sucess': 'success', 'supercede': 'supersede',
      'suprise': 'surprise', 'surpress': 'suppress', 'sytem': 'system',
      'tecnical': 'technical', 'techology': 'technology', 'temperture': 'temperature',
      'templete': 'template', 'templat': 'template', 'tendancy': 'tendency',
      'therefor': 'therefore', 'threshhold': 'threshold', 'tommorow': 'tomorrow',
      'tounge': 'tongue', 'truely': 'truly', 'typcial': 'typical',
      'underate': 'underrate', 'unfortunatly': 'unfortunately', 'unitl': 'until',
      'unusuall': 'unusual', 'useable': 'usable', 'usefull': 'useful',
      'utillity': 'utility', 'utilites': 'utilities',
      'vaccum': 'vacuum', 'valueable': 'valuable', 'varient': 'variant',
      'vegatable': 'vegetable', 'vehical': 'vehicle', 'visable': 'visible',
      'wether': 'whether', 'wierd': 'weird', 'wellcome': 'welcome',
      'wich': 'which', 'widgit': 'widget', 'writting': 'writing',
    };

    // Common file extensions to ignore during spell check
    this.knownExtensions = new Set([
      'js', 'jsx', 'ts', 'tsx', 'css', 'scss', 'sass', 'less', 'html', 'htm',
      'json', 'xml', 'yaml', 'yml', 'toml', 'ini', 'env', 'md', 'mdx', 'txt',
      'csv', 'tsv', 'sql', 'db', 'sqlite', 'png', 'jpg', 'jpeg', 'gif', 'svg',
      'webp', 'ico', 'bmp', 'tiff', 'pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt',
      'pptx', 'zip', 'rar', 'tar', 'gz', 'bz2', '7z', 'py', 'rb', 'go', 'rs',
      'java', 'kt', 'swift', 'c', 'cpp', 'h', 'hpp', 'cs', 'php', 'pl', 'r',
      'sh', 'bash', 'zsh', 'bat', 'ps1', 'psm1', 'cmd', 'mp3', 'wav', 'ogg',
      'flac', 'mp4', 'avi', 'mov', 'mkv', 'webm', 'woff', 'woff2', 'ttf', 'otf',
      'eot', 'lock', 'log', 'map', 'min', 'config', 'conf', 'cfg', 'gitignore',
      'gitkeep', 'gitattributes', 'dockerignore', 'editorconfig', 'eslintrc',
      'prettierrc', 'babelrc', 'npmrc', 'nvmrc', 'node', 'mjs', 'cjs', 'vue',
      'svelte', 'astro', 'prisma', 'graphql', 'gql', 'proto', 'wasm',
    ]);

    // Known technical terms / abbreviations to skip
    this.knownTerms = new Set([
      'src', 'dist', 'lib', 'bin', 'tmp', 'dev', 'prod', 'env', 'config',
      'utils', 'util', 'api', 'apis', 'auth', 'oauth', 'jwt', 'cors', 'csrf',
      'http', 'https', 'url', 'urls', 'uri', 'uris', 'cdn', 'dns', 'ssl', 'tls',
      'tcp', 'udp', 'ftp', 'ssh', 'smtp', 'imap', 'pop', 'grpc', 'graphql',
      'sql', 'nosql', 'orm', 'crud', 'mvc', 'mvvm', 'dto', 'dao',
      'html', 'css', 'scss', 'sass', 'less', 'dom', 'svg', 'xml', 'json', 'yaml',
      'jsx', 'tsx', 'vue', 'svelte', 'astro', 'mdx',
      'npm', 'npx', 'pnpm', 'yarn', 'bun', 'deno', 'nvm',
      'webpack', 'vite', 'rollup', 'esbuild', 'turbopack', 'parcel', 'babel',
      'eslint', 'prettier', 'stylelint', 'husky', 'lint',
      'react', 'nextjs', 'nuxt', 'remix', 'gatsby', 'angular', 'ember',
      'redux', 'zustand', 'mobx', 'recoil', 'jotai',
      'tailwind', 'bootstrap', 'mui', 'chakra', 'antd',
      'prisma', 'drizzle', 'sequelize', 'mongoose', 'typeorm', 'knex',
      'postgres', 'mysql', 'sqlite', 'redis', 'mongo', 'mongodb', 'supabase',
      'vercel', 'netlify', 'heroku', 'aws', 'gcp', 'azure', 'docker', 'kubernetes',
      'github', 'gitlab', 'bitbucket', 'ci', 'cd', 'devops',
      'middleware', 'webhook', 'websocket', 'ssr', 'ssg', 'isr', 'csr', 'spa', 'pwa',
      'async', 'await', 'callback', 'promise', 'observable', 'regex', 'regexp',
      'init', 'setup', 'teardown', 'cleanup', 'polyfill', 'shim',
      'todo', 'fixme', 'hack', 'temp', 'wip', 'poc', 'mvp',
      'readme', 'changelog', 'contributing', 'codeowners', 'makefile', 'dockerfile',
      'gitignore', 'gitkeep', 'editorconfig', 'browserslist',
      'pkg', 'cmd', 'args', 'opts', 'params', 'ctx', 'req', 'res', 'err', 'msg',
      'btn', 'nav', 'img', 'bg', 'fg', 'sm', 'md', 'lg', 'xl', 'xxl',
      'min', 'max', 'avg', 'idx', 'len', 'num', 'str', 'int', 'bool', 'obj', 'arr',
      'fn', 'func', 'cb', 'ref', 'refs', 'val', 'vals', 'var', 'vars',
      'prev', 'curr', 'next', 'iter', 'elem', 'attr', 'prop', 'props',
      'spec', 'specs', 'test', 'tests', 'mock', 'mocks', 'stub', 'stubs', 'fixture',
      'e2e', 'a11y', 'i18n', 'l10n', 'rtl', 'ltr',
      'rgba', 'hsla', 'hex', 'rgb', 'hsl',
      'uuid', 'guid', 'cuid', 'nanoid', 'ulid',
      'asc', 'desc', 'enum', 'const', 'readonly',
      'admin', 'superadmin', 'sysadmin',
      'signup', 'signin', 'login', 'logout', 'onboarding',
      'favicon', 'sitemap', 'robots', 'manifest', 'sw',
      'vercelignore', 'npmignore', 'eslintignore', 'prettierignore',
      'tsconfig', 'jsconfig', 'postcss', 'tailwindcss',
      'node_modules', 'package', 'lockfile',
    ]);
  }

  scanStructure(node, path = []) {
    const issues = [];
    this._scanNode(node, path, issues);
    return issues;
  }

  _scanNode(node, path, issues) {
    // Check this node's name (skip root)
    if (path.length > 0) {
      const nameIssues = this._checkName(node.name, node.type, path);
      issues.push(...nameIssues);
    }

    // Recurse into children
    if (node.children) {
      node.children.forEach((child, i) => {
        this._scanNode(child, [...path, i], issues);
      });
    }
  }

  _checkName(name, type, path) {
    const issues = [];
    const isFolder = type === 'folder';

    // Extract name without extension for files
    let baseName = name;
    let extension = '';
    if (!isFolder && name.includes('.')) {
      const lastDot = name.lastIndexOf('.');
      baseName = name.substring(0, lastDot);
      extension = name.substring(lastDot + 1).toLowerCase();
    }

    // 1. SPELL CHECK — check each word in the name
    const words = this._extractWords(baseName);
    for (const word of words) {
      const lower = word.toLowerCase();

      // Skip known terms, short words, numbers
      if (this.knownTerms.has(lower)) continue;
      if (lower.length <= 2) continue;
      if (/^\d+$/.test(lower)) continue;
      if (this.knownExtensions.has(lower)) continue;

      // Check misspellings dictionary
      if (this.misspellings[lower]) {
        const suggestion = this._replaceMisspelling(name, word, this.misspellings[lower]);
        issues.push({
          id: ++this.issueId,
          path,
          original: name,
          message: `"${word}" may be misspelled`,
          suggestion,
          severity: 'warning',
          category: 'Spelling'
        });
      }

      // Check for repeated consecutive letters (3+)
      if (/(.)\1{2,}/.test(lower) && !this.knownTerms.has(lower)) {
        const fixed = lower.replace(/(.)\1{2,}/g, '$1$1');
        if (fixed !== lower && this.misspellings[fixed]) {
          const suggestion = this._replaceMisspelling(name, word, this.misspellings[fixed]);
          issues.push({
            id: ++this.issueId,
            path,
            original: name,
            message: `"${word}" has repeated letters`,
            suggestion,
            severity: 'warning',
            category: 'Spelling'
          });
        }
      }
    }

    // 2. NAMING CONVENTION CHECKS

    // Check for spaces in names
    if (name.includes(' ')) {
      const kebab = name.replace(/\s+/g, '-').toLowerCase();
      issues.push({
        id: ++this.issueId,
        path,
        original: name,
        message: 'Contains spaces — use hyphens or underscores instead',
        suggestion: kebab,
        severity: 'warning',
        category: 'Convention'
      });
    }

    // Check for special characters (excluding . - _ and path separators)
    if (/[^a-zA-Z0-9._\-\s]/.test(name)) {
      const cleaned = name.replace(/[^a-zA-Z0-9._\-]/g, '-').replace(/-{2,}/g, '-');
      issues.push({
        id: ++this.issueId,
        path,
        original: name,
        message: 'Contains special characters that may cause issues',
        suggestion: cleaned,
        severity: 'error',
        category: 'Convention'
      });
    }

    // Check for mixed naming conventions (camelCase mixed with kebab-case or snake_case)
    if (baseName.includes('-') && baseName.includes('_')) {
      issues.push({
        id: ++this.issueId,
        path,
        original: name,
        message: 'Mixes hyphens and underscores — pick one convention',
        suggestion: name.replace(/_/g, '-'),
        severity: 'info',
        category: 'Convention'
      });
    }

    // Check for leading/trailing dots, hyphens, underscores (except dotfiles)
    if (/^[-_]|[-_]$/.test(name)) {
      const trimmed = name.replace(/^[-_]+|[-_]+$/g, '');
      issues.push({
        id: ++this.issueId,
        path,
        original: name,
        message: 'Has leading or trailing hyphens/underscores',
        suggestion: trimmed,
        severity: 'warning',
        category: 'Convention'
      });
    }

    // Check for double extensions (e.g., file.txt.bak)
    if (!isFolder) {
      const dots = name.split('.').length - 1;
      if (dots > 1 && !name.endsWith('.d.ts') && !name.endsWith('.test.js') &&
          !name.endsWith('.test.ts') && !name.endsWith('.spec.js') &&
          !name.endsWith('.spec.ts') && !name.endsWith('.module.css') &&
          !name.endsWith('.module.scss') && !name.endsWith('.config.js') &&
          !name.endsWith('.config.ts') && !name.endsWith('.config.mjs') &&
          !name.endsWith('.min.js') && !name.endsWith('.min.css') &&
          !name.endsWith('.stories.tsx') && !name.endsWith('.stories.jsx') &&
          !name.endsWith('.stories.js') && !name.endsWith('.stories.ts') &&
          !name.endsWith('.tar.gz') && !name.endsWith('.d.mts') &&
          !name.endsWith('.d.cts')) {
        issues.push({
          id: ++this.issueId,
          path,
          original: name,
          message: 'Has multiple extensions — this may be unintentional',
          suggestion: null,
          severity: 'info',
          category: 'Convention'
        });
      }
    }

    // Check for very long names (> 50 chars)
    if (name.length > 50) {
      issues.push({
        id: ++this.issueId,
        path,
        original: name,
        message: `Name is ${name.length} characters — consider shortening`,
        suggestion: null,
        severity: 'info',
        category: 'Convention'
      });
    }

    // Check for uppercase folder names (convention: folders usually lowercase)
    if (isFolder && /[A-Z]/.test(name) && !name.startsWith('.')) {
      // Skip common PascalCase component folders
      const pascalExceptions = ['Components', 'Pages', 'Views', 'Models', 'Services',
        'Hooks', 'Utils', 'Helpers', 'Types', 'Interfaces', 'Constants', 'Assets'];
      if (!pascalExceptions.includes(name)) {
        const lower = name.toLowerCase();
        if (lower !== name) {
          issues.push({
            id: ++this.issueId,
            path,
            original: name,
            message: 'Folder names are typically lowercase',
            suggestion: lower,
            severity: 'info',
            category: 'Convention'
          });
        }
      }
    }

    // Check for consecutive hyphens or underscores
    if (/[-]{2,}|[_]{2,}/.test(name)) {
      const fixed = name.replace(/-{2,}/g, '-').replace(/_{2,}/g, '_');
      issues.push({
        id: ++this.issueId,
        path,
        original: name,
        message: 'Has consecutive hyphens or underscores',
        suggestion: fixed,
        severity: 'warning',
        category: 'Convention'
      });
    }

    return issues;
  }

  _extractWords(name) {
    // Split by common separators: hyphens, underscores, dots, camelCase
    return name
      .replace(/([a-z])([A-Z])/g, '$1 $2') // camelCase split
      .replace(/([A-Z]+)([A-Z][a-z])/g, '$1 $2') // ABCDef -> ABC Def
      .split(/[-_.\s]+/)
      .filter(w => w.length > 0);
  }

  _replaceMisspelling(original, misspelled, correction) {
    // Try to preserve the original casing style
    if (misspelled === misspelled.toUpperCase()) {
      correction = correction.toUpperCase();
    } else if (misspelled[0] === misspelled[0].toUpperCase()) {
      correction = correction[0].toUpperCase() + correction.slice(1);
    }

    // Replace in the original name
    const regex = new RegExp(misspelled.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
    return original.replace(regex, correction);
  }
}
