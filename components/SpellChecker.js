export default class SpellChecker {
  constructor() {
    this.issueId = 0;

    // Common misspellings dictionary (comprehensive — 700+)
    this.misspellings = {
      // A
      'abandonned': 'abandoned', 'aberation': 'aberration', 'abilty': 'ability',
      'abotu': 'about', 'abscence': 'absence', 'absense': 'absence',
      'abundacne': 'abundance', 'accademic': 'academic', 'accademy': 'academy',
      'accesories': 'accessories', 'accessable': 'accessible', 'accesible': 'accessible',
      'accidently': 'accidentally', 'accomodate': 'accommodate', 'accomodation': 'accommodation',
      'accompanyed': 'accompanied', 'accoring': 'according', 'accross': 'across',
      'acheive': 'achieve', 'acheivment': 'achievement', 'achievment': 'achievement',
      'acknowlege': 'acknowledge', 'acknowledgeing': 'acknowledging',
      'acquaintence': 'acquaintance', 'acquiantance': 'acquaintance',
      'aquisition': 'acquisition', 'acquistion': 'acquisition',
      'activly': 'actively', 'acuracy': 'accuracy', 'acurate': 'accurate',
      'addional': 'additional', 'additionaly': 'additionally', 'adequit': 'adequate',
      'adherance': 'adherence', 'adress': 'address', 'adresing': 'addressing',
      'advertisment': 'advertisement', 'adviced': 'advised', 'adviseable': 'advisable',
      'affilate': 'affiliate', 'affilliate': 'affiliate',
      'aggreed': 'agreed', 'aggreement': 'agreement', 'agressive': 'aggressive',
      'agressively': 'aggressively', 'aknowledge': 'acknowledge',
      'aledge': 'allege', 'algorythm': 'algorithm', 'algoritm': 'algorithm',
      'aligment': 'alignment', 'alledge': 'allege', 'alledgedly': 'allegedly',
      'allocaton': 'allocation', 'alot': 'a lot', 'alowed': 'allowed',
      'alowing': 'allowing', 'alternitave': 'alternative', 'alternitive': 'alternative',
      'altho': 'although', 'altough': 'although', 'aluminium': 'aluminum',
      'amature': 'amateur', 'ammend': 'amend', 'ammendment': 'amendment',
      'amoung': 'among', 'amout': 'amount', 'analisis': 'analysis',
      'analysys': 'analysis', 'analitical': 'analytical', 'analize': 'analyze',
      'anaylsis': 'analysis', 'anaylze': 'analyze', 'annoucement': 'announcement',
      'annonymous': 'anonymous', 'anonimous': 'anonymous', 'anounce': 'announce',
      'aparent': 'apparent', 'aparently': 'apparently', 'aplication': 'application',
      'appereance': 'appearance', 'apperance': 'appearance', 'applicaiton': 'application',
      'applicaton': 'application', 'appologies': 'apologies', 'appologize': 'apologize',
      'appoximately': 'approximately', 'approch': 'approach', 'appropirate': 'appropriate',
      'apropriate': 'appropriate', 'aquire': 'acquire', 'aquired': 'acquired',
      'arbitraty': 'arbitrary', 'archieve': 'archive', 'architeture': 'architecture',
      'arguement': 'argument', 'arival': 'arrival', 'arrangment': 'arrangement',
      'artical': 'article', 'assasination': 'assassination', 'assesment': 'assessment',
      'assest': 'asset', 'assests': 'assets', 'asign': 'assign',
      'asignment': 'assignment', 'assistence': 'assistance', 'assistent': 'assistant',
      'assocaite': 'associate', 'assocation': 'association', 'asssociation': 'association',
      'assumtion': 'assumption', 'athiest': 'atheist', 'atribute': 'attribute',
      'attatch': 'attach', 'attatchment': 'attachment', 'attemp': 'attempt',
      'attendence': 'attendance', 'auther': 'author', 'authers': 'authors',
      'authorisation': 'authorization', 'authorise': 'authorize',
      'automaticly': 'automatically', 'availabe': 'available', 'availible': 'available',
      'averege': 'average',

      // B
      'bakcup': 'backup', 'backgorund': 'background', 'backgroud': 'background',
      'balence': 'balance', 'basicly': 'basically', 'beautifull': 'beautiful',
      'becasue': 'because', 'becuase': 'because', 'becomming': 'becoming',
      'befor': 'before', 'begining': 'beginning', 'beginining': 'beginning',
      'behavor': 'behavior', 'behaviour': 'behavior', 'beleive': 'believe',
      'beleiving': 'believing', 'benificial': 'beneficial', 'benifit': 'benefit',
      'benifits': 'benefits', 'betwen': 'between', 'boundry': 'boundary',
      'breif': 'brief', 'breifly': 'briefly', 'broadcat': 'broadcast',
      'buget': 'budget', 'buisness': 'business', 'buisiness': 'business',
      'buletin': 'bulletin', 'buton': 'button', 'bytestream': 'byte stream',

      // C
      'calandar': 'calendar', 'calander': 'calendar', 'calender': 'calendar',
      'caluculate': 'calculate', 'calculater': 'calculator', 'campain': 'campaign',
      'cancelation': 'cancellation', 'candiate': 'candidate', 'capabilty': 'capability',
      'catagory': 'category', 'catagories': 'categories', 'categroy': 'category',
      'catogorise': 'categorize', 'certian': 'certain', 'chalenge': 'challenge',
      'changable': 'changeable', 'charachter': 'character', 'charater': 'character',
      'cheif': 'chief', 'childerns': 'children', 'childrens': 'children',
      'choise': 'choice', 'circut': 'circuit', 'circumsatance': 'circumstance',
      'claer': 'clear', 'clasification': 'classification', 'cliant': 'client',
      'colection': 'collection', 'collabarate': 'collaborate', 'colaborate': 'collaborate',
      'collegue': 'colleague', 'colum': 'column', 'comand': 'command',
      'comision': 'commission', 'comited': 'committed', 'comming': 'coming',
      'commited': 'committed', 'commitee': 'committee', 'commment': 'comment',
      'communiation': 'communication', 'communicaiton': 'communication',
      'comparision': 'comparison', 'compatable': 'compatible', 'compatability': 'compatibility',
      'compeletly': 'completely', 'completly': 'completely', 'complience': 'compliance',
      'componant': 'component', 'componnent': 'component', 'compreshensive': 'comprehensive',
      'comprimise': 'compromise', 'concious': 'conscious', 'conciously': 'consciously',
      'condtion': 'condition', 'confedential': 'confidential', 'confidental': 'confidential',
      'configration': 'configuration', 'configuraton': 'configuration',
      'congradulations': 'congratulations', 'connnection': 'connection',
      'connexion': 'connection', 'conqure': 'conquer', 'consciencious': 'conscientious',
      'consectuive': 'consecutive', 'consequtive': 'consecutive',
      'consequnce': 'consequence', 'consistant': 'consistent', 'consistantly': 'consistently',
      'consolodate': 'consolidate', 'constrainst': 'constraints',
      'constuction': 'construction', 'consultent': 'consultant',
      'consumtion': 'consumption', 'containes': 'contains', 'containts': 'contains',
      'contempory': 'contemporary', 'contibute': 'contribute', 'contibution': 'contribution',
      'continous': 'continuous', 'continuos': 'continuous', 'continously': 'continuously',
      'contorll': 'control', 'controll': 'control', 'controler': 'controller',
      'conveinence': 'convenience', 'convienient': 'convenient',
      'convertion': 'conversion', 'coordiantion': 'coordination',
      'copywrite': 'copyright', 'corosion': 'corrosion', 'corect': 'correct',
      'corection': 'correction', 'correspondance': 'correspondence',
      'corupt': 'corrupt', 'coruption': 'corruption', 'coudl': 'could',
      'councelling': 'counseling', 'creaeted': 'created', 'critcal': 'critical',
      'critera': 'criteria', 'critereon': 'criterion', 'critisism': 'criticism',
      'curiousity': 'curiosity', 'currenly': 'currently', 'currrent': 'current',
      'custmer': 'customer', 'custmers': 'customers', 'customise': 'customize',

      // D
      'damamge': 'damage', 'dangerious': 'dangerous', 'databse': 'database',
      'databaes': 'database', 'deadlien': 'deadline', 'decison': 'decision',
      'decleration': 'declaration', 'decribe': 'describe', 'decription': 'description',
      'defaut': 'default', 'defenately': 'definitely', 'defencive': 'defensive',
      'defered': 'deferred', 'definate': 'definite', 'definately': 'definitely',
      'definitly': 'definitely', 'defintion': 'definition', 'delet': 'delete',
      'delivary': 'delivery', 'delievery': 'delivery', 'demostrate': 'demonstrate',
      'dependant': 'dependent', 'dependancy': 'dependency', 'dependecy': 'dependency',
      'deploied': 'deployed', 'deployement': 'deployment', 'depricated': 'deprecated',
      'derivitive': 'derivative', 'desgin': 'design', 'desiger': 'designer',
      'desparate': 'desperate', 'destory': 'destroy', 'detial': 'detail',
      'develope': 'develop', 'developement': 'development', 'devlopment': 'development',
      'devloper': 'developer', 'diagramm': 'diagram', 'dialoge': 'dialogue',
      'dicionary': 'dictionary', 'diferent': 'different', 'diffrent': 'different',
      'diffcult': 'difficult', 'dificult': 'difficult', 'dilema': 'dilemma',
      'dimention': 'dimension', 'dimentional': 'dimensional', 'directoy': 'directory',
      'directorey': 'directory', 'disapear': 'disappear', 'disapoint': 'disappoint',
      'disasterous': 'disastrous', 'discipine': 'discipline', 'disconect': 'disconnect',
      'discusion': 'discussion', 'dispaly': 'display', 'dissapear': 'disappear',
      'dissapoint': 'disappoint', 'distribusion': 'distribution',
      'distrubute': 'distribute', 'documnet': 'document', 'docuemnt': 'document',
      'documennts': 'documents', 'documentaion': 'documentation',
      'dosent': 'doesnt', 'donwload': 'download', 'dowload': 'download',
      'droping': 'dropping', 'dupicate': 'duplicate', 'durring': 'during',
      'dyamnic': 'dynamic', 'dynmaic': 'dynamic',

      // E
      'eachother': 'each other', 'eariler': 'earlier', 'easliy': 'easily',
      'ecconomy': 'economy', 'ecomerce': 'ecommerce', 'editting': 'editing',
      'efective': 'effective', 'effectivly': 'effectively', 'efficency': 'efficiency',
      'efficent': 'efficient', 'eficient': 'efficient', 'effeciency': 'efficiency',
      'elemet': 'element', 'eleminate': 'eliminate', 'eligable': 'eligible',
      'embarass': 'embarrass', 'embarassing': 'embarrassing', 'emergancy': 'emergency',
      'emision': 'emission', 'employe': 'employee', 'employeed': 'employed',
      'emty': 'empty', 'enble': 'enable', 'encription': 'encryption',
      'endpont': 'endpoint', 'enginer': 'engineer', 'enginneering': 'engineering',
      'enhancment': 'enhancement', 'enought': 'enough', 'enrole': 'enroll',
      'enterance': 'entrance', 'entireley': 'entirely', 'entitiy': 'entity',
      'entrprise': 'enterprise', 'enviroment': 'environment', 'enviorment': 'environment',
      'enviornment': 'environment', 'equipement': 'equipment', 'equiptment': 'equipment',
      'equivelant': 'equivalent', 'equivilent': 'equivalent', 'erroneus': 'erroneous',
      'esential': 'essential', 'essense': 'essence', 'essentail': 'essential',
      'establising': 'establishing', 'estimat': 'estimate', 'evalution': 'evaluation',
      'eventualy': 'eventually', 'everthing': 'everything', 'evidentally': 'evidently',
      'exagerate': 'exaggerate', 'exapmle': 'example', 'excelent': 'excellent',
      'excercise': 'exercise', 'exection': 'execution', 'exectue': 'execute',
      'exeedingly': 'exceedingly', 'exeption': 'exception', 'exisiting': 'existing',
      'existance': 'existence', 'exmaple': 'example', 'expecially': 'especially',
      'expereince': 'experience', 'experiance': 'experience', 'experiement': 'experiment',
      'explaination': 'explanation', 'explict': 'explicit', 'explictly': 'explicitly',
      'expresion': 'expression', 'extention': 'extension', 'extenal': 'external',
      'extremly': 'extremely',

      // F
      'facillitate': 'facilitate', 'facillity': 'facility', 'failuer': 'failure',
      'familar': 'familiar', 'familliar': 'familiar', 'favourate': 'favourite',
      'feasability': 'feasibility', 'featchure': 'feature', 'feautre': 'feature',
      'Febuary': 'February', 'fiels': 'files', 'fieled': 'field',
      'figuere': 'figure', 'filname': 'filename', 'finaly': 'finally',
      'finacial': 'financial', 'financal': 'financial', 'flourescent': 'fluorescent',
      'follwing': 'following', 'foriegn': 'foreign', 'formated': 'formatted',
      'formating': 'formatting', 'forteen': 'fourteen', 'forwrd': 'forward',
      'fourty': 'forty', 'framwork': 'framework', 'freind': 'friend',
      'frequancy': 'frequency', 'frequentely': 'frequently', 'fulfil': 'fulfill',
      'fullfill': 'fulfill', 'funcation': 'function', 'functionailty': 'functionality',
      'functionalty': 'functionality', 'fundametal': 'fundamental',
      'furthur': 'further',

      // G
      'garentee': 'guarantee', 'gaurd': 'guard', 'generaly': 'generally',
      'genrate': 'generate', 'genearte': 'generate', 'gloabl': 'global',
      'goverment': 'government', 'govenment': 'government', 'goverenance': 'governance',
      'gramar': 'grammar', 'grammer': 'grammar', 'greatful': 'grateful',
      'guage': 'gauge', 'guidence': 'guidance', 'guidlines': 'guidelines',

      // H
      'hadle': 'handle', 'hadnle': 'handle', 'handeling': 'handling',
      'happend': 'happened', 'harrass': 'harass', 'harrassment': 'harassment',
      'heirarchy': 'hierarchy', 'hiearchy': 'hierarchy', 'hierachy': 'hierarchy',
      'heigth': 'height', 'hieght': 'height', 'helpfull': 'helpful',
      'hightlight': 'highlight', 'highligth': 'highlight', 'historicly': 'historically',
      'hogspitality': 'hospitality', 'hosptiality': 'hospitality', 'hosptality': 'hospitality',
      'horizonal': 'horizontal', 'howver': 'however', 'hygeine': 'hygiene',
      'hypethetical': 'hypothetical',

      // I
      'identifer': 'identifier', 'identifiy': 'identify', 'ignorence': 'ignorance',
      'illegle': 'illegal', 'ilustrate': 'illustrate', 'imediate': 'immediate',
      'immediatly': 'immediately', 'imediately': 'immediately',
      'impelment': 'implement', 'implemenation': 'implementation',
      'implementaion': 'implementation', 'impliment': 'implement',
      'importent': 'important', 'imposible': 'impossible', 'improvment': 'improvement',
      'inaccurate': 'inaccurate', 'incidently': 'incidentally',
      'inclued': 'include', 'incorect': 'incorrect',
      'increse': 'increase', 'independant': 'independent', 'independantly': 'independently',
      'indespensable': 'indispensable', 'indispensible': 'indispensable',
      'indivdual': 'individual', 'indvidual': 'individual',
      'infomation': 'information', 'informaton': 'information',
      'infrastucture': 'infrastructure', 'infrastrucutre': 'infrastructure',
      'inheritence': 'inheritance', 'initalize': 'initialize', 'initilize': 'initialize',
      'initializaton': 'initialization', 'innoculate': 'inoculate',
      'inovation': 'innovation', 'inovative': 'innovative',
      'insatlled': 'installed', 'instalation': 'installation', 'instaled': 'installed',
      'instanse': 'instance', 'instuction': 'instruction', 'instrucions': 'instructions',
      'insufficent': 'insufficient', 'integraton': 'integration',
      'inteligence': 'intelligence', 'inteligent': 'intelligent',
      'intened': 'intended', 'interacton': 'interaction', 'interfer': 'interfere',
      'interferance': 'interference', 'intermitent': 'intermittent',
      'internel': 'internal', 'interpet': 'interpret', 'interpretter': 'interpreter',
      'intresting': 'interesting', 'introducion': 'introduction',
      'intutive': 'intuitive', 'intuative': 'intuitive',
      'invalide': 'invalid', 'invesment': 'investment', 'investiagte': 'investigate',
      'involvment': 'involvement', 'iresistible': 'irresistible',
      'irrelevent': 'irrelevant', 'isnt': 'isnt', 'isssue': 'issue',
      'iteraton': 'iteration',

      // J
      'javacsript': 'javascript', 'javascrpt': 'javascript', 'javscript': 'javascript',
      'jewlery': 'jewelry', 'judgement': 'judgment', 'justificaton': 'justification',

      // K
      'kernal': 'kernel', 'knowlege': 'knowledge', 'knowlede': 'knowledge',
      'knowledgable': 'knowledgeable',

      // L
      'lable': 'label', 'labratory': 'laboratory', 'langauge': 'language',
      'langugage': 'language', 'lauch': 'launch', 'launhed': 'launched',
      'layour': 'layout', 'lenght': 'length', 'liason': 'liaison',
      'libary': 'library', 'libraray': 'library', 'librery': 'library',
      'licesne': 'license', 'licencse': 'license', 'lightening': 'lightning',
      'likley': 'likely', 'limiation': 'limitation', 'limitied': 'limited',
      'lisense': 'license', 'littel': 'little', 'locaiton': 'location',
      'loggin': 'logging', 'logicaly': 'logically',

      // M
      'maintenace': 'maintenance', 'maintainance': 'maintenance',
      'maintanence': 'maintenance', 'managment': 'management',
      'managament': 'management', 'manger': 'manager', 'mannager': 'manager',
      'manaul': 'manual', 'manualy': 'manually', 'manufacure': 'manufacture',
      'maximium': 'maximum', 'measurment': 'measurement', 'mechanisim': 'mechanism',
      'medival': 'medieval', 'memeber': 'member', 'messge': 'message',
      'mesage': 'message', 'methood': 'method', 'methodolgy': 'methodology',
      'millenium': 'millennium', 'milion': 'million', 'minature': 'miniature',
      'mininum': 'minimum', 'minimium': 'minimum', 'mispell': 'misspell',
      'mispelling': 'misspelling', 'miscelaneous': 'miscellaneous',
      'miscellanous': 'miscellaneous', 'modifed': 'modified', 'modifiy': 'modify',
      'moduel': 'module', 'modle': 'model', 'moniter': 'monitor',
      'montior': 'monitor', 'morgage': 'mortgage', 'mulitple': 'multiple',
      'mutiple': 'multiple',

      // N
      'naturaly': 'naturally', 'neccesary': 'necessary', 'neccessary': 'necessary',
      'necessery': 'necessary', 'necesary': 'necessary', 'negociate': 'negotiate',
      'negotation': 'negotiation', 'neigbor': 'neighbor', 'nieghbor': 'neighbor',
      'neighbour': 'neighbor', 'netowrk': 'network', 'noticable': 'noticeable',
      'notificaton': 'notification', 'nuber': 'number', 'nubmer': 'number',

      // O
      'obatin': 'obtain', 'obejct': 'object', 'occassion': 'occasion',
      'occassionally': 'occasionally', 'occured': 'occurred', 'occurence': 'occurrence',
      'occuring': 'occurring', 'offical': 'official', 'offically': 'officially',
      'omision': 'omission', 'onboading': 'onboarding', 'opeartion': 'operation',
      'opertaion': 'operation', 'operaton': 'operation', 'oportunity': 'opportunity',
      'oppurtunity': 'opportunity', 'optimze': 'optimize', 'optimizaton': 'optimization',
      'optinal': 'optional', 'organisaton': 'organization', 'orginal': 'original',
      'orginally': 'originally', 'ouput': 'output', 'outptu': 'output',
      'overide': 'override', 'overiding': 'overriding', 'overwite': 'overwrite',

      // P
      'pacakge': 'package', 'packge': 'package', 'pagenation': 'pagination',
      'paginaton': 'pagination', 'paralel': 'parallel', 'paralell': 'parallel',
      'paramater': 'parameter', 'paramter': 'parameter', 'parliment': 'parliament',
      'particpant': 'participant', 'particulary': 'particularly',
      'partiton': 'partition', 'passtime': 'pastime', 'pasword': 'password',
      'pateint': 'patient', 'patern': 'pattern', 'patterm': 'pattern',
      'percieve': 'perceive', 'performace': 'performance', 'performence': 'performance',
      'peice': 'piece', 'peroid': 'period', 'permision': 'permission',
      'permisions': 'permissions', 'persistance': 'persistence',
      'persistant': 'persistent', 'personel': 'personnel', 'persue': 'pursue',
      'phenomemon': 'phenomenon', 'phisical': 'physical', 'planing': 'planning',
      'platfrom': 'platform', 'platofrm': 'platform', 'playwrite': 'playwright',
      'plesae': 'please', 'plese': 'please', 'polisy': 'policy',
      'posession': 'possession', 'posible': 'possible', 'possiblity': 'possibility',
      'potatos': 'potatoes', 'potental': 'potential', 'powerfull': 'powerful',
      'practise': 'practice', 'preceed': 'precede', 'preceeding': 'preceding',
      'precisly': 'precisely', 'prefered': 'preferred', 'preferance': 'preference',
      'preformance': 'performance', 'prepairation': 'preparation',
      'presance': 'presence', 'presense': 'presence', 'preveiw': 'preview',
      'preivew': 'preview', 'prevous': 'previous', 'pricipal': 'principal',
      'primarly': 'primarily', 'prinicple': 'principle', 'privelege': 'privilege',
      'privelage': 'privilege', 'probaly': 'probably', 'probem': 'problem',
      'proccess': 'process', 'proceedure': 'procedure', 'procesing': 'processing',
      'procuct': 'product', 'profesional': 'professional', 'profesion': 'profession',
      'profie': 'profile', 'programing': 'programming', 'progam': 'program',
      'progess': 'progress', 'progresive': 'progressive', 'prohibted': 'prohibited',
      'projcet': 'project', 'promiss': 'promise', 'promt': 'prompt',
      'propogate': 'propagate', 'propper': 'proper', 'propperly': 'properly',
      'proprty': 'property', 'protcol': 'protocol', 'protocal': 'protocol',
      'provde': 'provide', 'provisonal': 'provisional', 'prupose': 'purpose',
      'publically': 'publicly', 'publising': 'publishing', 'purchse': 'purchase',

      // Q
      'qualifed': 'qualified', 'quanitty': 'quantity', 'quarentine': 'quarantine',
      'questionaire': 'questionnaire', 'que': 'queue', 'queu': 'queue',
      'quickley': 'quickly',

      // R
      'radom': 'random', 'realy': 'really', 'realise': 'realize',
      'realstic': 'realistic', 'reaosn': 'reason', 'reccomend': 'recommend',
      'reccommend': 'recommend', 'recieve': 'receive', 'recieved': 'received',
      'recievables': 'receivables', 'recognise': 'recognize', 'recomend': 'recommend',
      'recomendation': 'recommendation', 'reconcilliation': 'reconciliation',
      'recrusion': 'recursion', 'recurrance': 'recurrence', 'recurse': 'recurse',
      'refrence': 'reference', 'referance': 'reference', 'referal': 'referral',
      'refered': 'referred', 'registartion': 'registration', 'registraion': 'registration',
      'regulaton': 'regulation', 'relaible': 'reliable', 'relevent': 'relevant',
      'relevence': 'relevance', 'religous': 'religious', 'remaing': 'remaining',
      'remeber': 'remember', 'remmeber': 'remember', 'removeable': 'removable',
      'rendring': 'rendering', 'repitition': 'repetition', 'reponse': 'response',
      'repositry': 'repository', 'repostiory': 'repository',
      'representaton': 'representation', 'represnt': 'represent',
      'requirment': 'requirement', 'requirments': 'requirements',
      'resouce': 'resource', 'resourse': 'resource', 'resorces': 'resources',
      'resoluton': 'resolution', 'responce': 'response', 'responcible': 'responsible',
      'resposible': 'responsible', 'responsiblity': 'responsibility',
      'restraunt': 'restaurant', 'restricton': 'restriction', 'retreive': 'retrieve',
      'retrive': 'retrieve', 'reveiw': 'review', 'reveiwer': 'reviewer',
      'rythm': 'rhythm', 'rythym': 'rhythm', 'rigourous': 'rigorous',
      'rollbak': 'rollback', 'runnning': 'running',

      // S
      'safty': 'safety', 'satisifed': 'satisfied', 'scedule': 'schedule',
      'shedule': 'schedule', 'scenerio': 'scenario', 'senario': 'scenario',
      'schduled': 'scheduled', 'schem': 'schema', 'scipt': 'script',
      'screeen': 'screen', 'seach': 'search', 'secuirty': 'security',
      'securty': 'security', 'seize': 'seize', 'selction': 'selection',
      'sentance': 'sentence', 'seperate': 'separate', 'seperately': 'separately',
      'seperator': 'separator', 'sequense': 'sequence', 'sergant': 'sergeant',
      'servise': 'service', 'sevral': 'several', 'shoud': 'should',
      'signficant': 'significant', 'significent': 'significant',
      'similiar': 'similar', 'simlar': 'similar', 'simplfy': 'simplify',
      'sinceerly': 'sincerely', 'singel': 'single', 'situaton': 'situation',
      'sofware': 'software', 'softwre': 'software', 'soluton': 'solution',
      'somthing': 'something', 'somethign': 'something', 'sorce': 'source',
      'soure': 'source', 'speach': 'speech', 'specfic': 'specific',
      'specificaly': 'specifically', 'specifiy': 'specify', 'standart': 'standard',
      'statment': 'statement', 'stratagy': 'strategy', 'stragety': 'strategy',
      'straegy': 'strategy', 'stratergy': 'strategy', 'stradegy': 'strategy',
      'strenght': 'strength', 'strenth': 'strength',
      'strucutre': 'structure', 'sturcture': 'structure', 'struture': 'structure',
      'subcribe': 'subscribe', 'submision': 'submission', 'subscrition': 'subscription',
      'substancial': 'substantial', 'succesful': 'successful',
      'successfull': 'successful', 'sucess': 'success', 'succcess': 'success',
      'suficient': 'sufficient', 'sugest': 'suggest', 'sugestion': 'suggestion',
      'sumary': 'summary', 'supercede': 'supersede', 'suplement': 'supplement',
      'suport': 'support', 'supose': 'suppose', 'suprise': 'surprise',
      'surpress': 'suppress', 'surrouding': 'surrounding', 'surveilance': 'surveillance',
      'suspicous': 'suspicious', 'symetric': 'symmetric', 'synchornize': 'synchronize',
      'syncronize': 'synchronize', 'sytem': 'system', 'systme': 'system',

      // T
      'tabel': 'table', 'targetting': 'targeting', 'teamplate': 'template',
      'tecnical': 'technical', 'techical': 'technical', 'techology': 'technology',
      'technolgy': 'technology', 'temperture': 'temperature', 'templete': 'template',
      'templat': 'template', 'tempalte': 'template', 'temporay': 'temporary',
      'temporarly': 'temporarily', 'tendancy': 'tendency', 'termnial': 'terminal',
      'terminolgy': 'terminology', 'testting': 'testing', 'therefor': 'therefore',
      'therfore': 'therefore', 'thier': 'their', 'thign': 'thing',
      'thoughout': 'throughout', 'throught': 'through', 'threshhold': 'threshold',
      'teh': 'the', 'tihs': 'this', 'timout': 'timeout',
      'togather': 'together', 'togehter': 'together', 'tommorow': 'tomorrow',
      'tommorrow': 'tomorrow', 'tounge': 'tongue', 'traditonal': 'traditional',
      'traing': 'training', 'transacion': 'transaction', 'transfered': 'transferred',
      'transfrom': 'transform', 'transistion': 'transition', 'transmision': 'transmission',
      'transparant': 'transparent', 'trasfer': 'transfer', 'trigered': 'triggered',
      'truely': 'truly', 'truncaton': 'truncation', 'typcial': 'typical',
      'typicaly': 'typically',

      // U
      'udpate': 'update', 'uknown': 'unknown', 'unautherized': 'unauthorized',
      'unauthorised': 'unauthorized', 'uncertian': 'uncertain',
      'underate': 'underrate', 'understadn': 'understand', 'unecesary': 'unnecessary',
      'unecessary': 'unnecessary', 'unexpcted': 'unexpected', 'unfortunatly': 'unfortunately',
      'unitl': 'until', 'univeral': 'universal', 'unknwon': 'unknown',
      'unles': 'unless', 'unnecesary': 'unnecessary', 'unusuall': 'unusual',
      'upcomming': 'upcoming', 'upgarde': 'upgrade', 'uploded': 'uploaded',
      'useable': 'usable', 'usefull': 'useful', 'useing': 'using',
      'utillity': 'utility', 'utilites': 'utilities', 'utilizaton': 'utilization',

      // V
      'vaccum': 'vacuum', 'vaiable': 'variable', 'vairable': 'variable',
      'validaton': 'validation', 'valueable': 'valuable', 'varient': 'variant',
      'varification': 'verification', 'vegatable': 'vegetable', 'vehical': 'vehicle',
      'verison': 'version', 'veriosn': 'version', 'verticle': 'vertical',
      'visable': 'visible', 'visibilty': 'visibility', 'vistors': 'visitors',
      'virutal': 'virtual', 'vulnerabilty': 'vulnerability', 'vulnerble': 'vulnerable',

      // W
      'waranty': 'warranty', 'warining': 'warning', 'warnign': 'warning',
      'wether': 'whether', 'wierd': 'weird', 'wellcome': 'welcome',
      'werre': 'were', 'whcih': 'which', 'wich': 'which',
      'widht': 'width', 'widgit': 'widget', 'wihtin': 'within',
      'wokring': 'working', 'workfow': 'workflow', 'worflow': 'workflow',
      'writting': 'writing', 'writen': 'written',

      // X, Y, Z
      'yeilding': 'yielding', 'yeild': 'yield',
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
      'dll', 'exe', 'so', 'dylib', 'class', 'jar', 'apk', 'ipa',
      'dmg', 'iso', 'img', 'bin', 'dat', 'bak', 'tmp', 'swp',
      'psd', 'ai', 'sketch', 'fig', 'xd',
      'mp2', 'aac', 'wma', 'wmv', 'flv', 'swf',
      'asm', 'v', 'sv', 'vhd', 'vhdl',
      'tex', 'bib', 'sty', 'cls',
      'ipynb', 'rmd', 'qmd',
    ]);

    // Known technical terms / abbreviations to skip (expanded)
    this.knownTerms = new Set([
      // Directories & common names
      'src', 'dist', 'lib', 'bin', 'tmp', 'dev', 'prod', 'env', 'config',
      'utils', 'util', 'api', 'apis', 'auth', 'oauth', 'jwt', 'cors', 'csrf',
      'http', 'https', 'url', 'urls', 'uri', 'uris', 'cdn', 'dns', 'ssl', 'tls',
      'tcp', 'udp', 'ftp', 'ssh', 'smtp', 'imap', 'pop', 'grpc', 'graphql',
      'sql', 'nosql', 'orm', 'crud', 'mvc', 'mvvm', 'dto', 'dao',
      // Web tech
      'html', 'css', 'scss', 'sass', 'less', 'dom', 'svg', 'xml', 'json', 'yaml',
      'jsx', 'tsx', 'vue', 'svelte', 'astro', 'mdx',
      // Package managers
      'npm', 'npx', 'pnpm', 'yarn', 'bun', 'deno', 'nvm',
      // Build tools
      'webpack', 'vite', 'rollup', 'esbuild', 'turbopack', 'parcel', 'babel',
      'eslint', 'prettier', 'stylelint', 'husky', 'lint', 'tsc',
      // Frameworks
      'react', 'nextjs', 'nuxt', 'remix', 'gatsby', 'angular', 'ember',
      'redux', 'zustand', 'mobx', 'recoil', 'jotai', 'tanstack',
      'tailwind', 'bootstrap', 'mui', 'chakra', 'antd', 'radix',
      // ORMs & DBs
      'prisma', 'drizzle', 'sequelize', 'mongoose', 'typeorm', 'knex',
      'postgres', 'mysql', 'sqlite', 'redis', 'mongo', 'mongodb', 'supabase',
      'dynamodb', 'cockroachdb', 'mariadb', 'cassandra', 'couchdb', 'neo4j',
      // Cloud & DevOps
      'vercel', 'netlify', 'heroku', 'aws', 'gcp', 'azure', 'docker', 'kubernetes',
      'github', 'gitlab', 'bitbucket', 'ci', 'cd', 'devops', 'terraform',
      'ansible', 'jenkins', 'circleci', 'travisci', 'nginx', 'apache', 'caddy',
      // Rendering & architecture
      'middleware', 'webhook', 'websocket', 'ssr', 'ssg', 'isr', 'csr', 'spa', 'pwa',
      'microservice', 'microservices', 'monorepo', 'monolith', 'serverless',
      // Programming
      'async', 'await', 'callback', 'promise', 'observable', 'regex', 'regexp',
      'init', 'setup', 'teardown', 'cleanup', 'polyfill', 'shim',
      'todo', 'fixme', 'hack', 'temp', 'wip', 'poc', 'mvp',
      // Config files
      'readme', 'changelog', 'contributing', 'codeowners', 'makefile', 'dockerfile',
      'gitignore', 'gitkeep', 'editorconfig', 'browserslist',
      'vercelignore', 'npmignore', 'eslintignore', 'prettierignore',
      'tsconfig', 'jsconfig', 'postcss', 'tailwindcss',
      'node_modules', 'package', 'lockfile',
      // Abbreviations
      'pkg', 'cmd', 'args', 'opts', 'params', 'ctx', 'req', 'res', 'err', 'msg',
      'btn', 'nav', 'img', 'bg', 'fg', 'sm', 'md', 'lg', 'xl', 'xxl',
      'min', 'max', 'avg', 'idx', 'len', 'num', 'str', 'int', 'bool', 'obj', 'arr',
      'fn', 'func', 'cb', 'ref', 'refs', 'val', 'vals', 'var', 'vars',
      'prev', 'curr', 'next', 'iter', 'elem', 'attr', 'prop', 'props',
      'spec', 'specs', 'test', 'tests', 'mock', 'mocks', 'stub', 'stubs', 'fixture',
      'e2e', 'a11y', 'i18n', 'l10n', 'rtl', 'ltr',
      // Colors
      'rgba', 'hsla', 'hex', 'rgb', 'hsl',
      // IDs
      'uuid', 'guid', 'cuid', 'nanoid', 'ulid',
      // Keywords
      'asc', 'desc', 'enum', 'const', 'readonly',
      // Roles
      'admin', 'superadmin', 'sysadmin',
      // Auth flows
      'signup', 'signin', 'login', 'logout', 'onboarding',
      // Web files
      'favicon', 'sitemap', 'robots', 'manifest', 'sw',
      // Additional tech terms
      'localhost', 'hostname', 'subdomain', 'cname', 'mx',
      'stdout', 'stderr', 'stdin', 'pid', 'uid', 'gid',
      'cron', 'crontab', 'daemon', 'systemd', 'launchd',
      'utf', 'ascii', 'unicode', 'base64', 'sha', 'hmac', 'aes', 'rsa',
      'oauth2', 'saml', 'ldap', 'sso', 'mfa', 'totp', 'otp',
      'cidr', 'vpc', 'subnet', 'nat', 'vpn', 'ipsec',
      'cpu', 'gpu', 'ram', 'ssd', 'hdd', 'nvme', 'bios', 'uefi',
      'sdk', 'cli', 'gui', 'tui', 'ide', 'repl',
      'gzip', 'brotli', 'zstd', 'lz4', 'snappy',
      'protobuf', 'msgpack', 'avro', 'parquet',
      'kafka', 'rabbitmq', 'nats', 'mqtt', 'amqp',
      'elasticsearch', 'kibana', 'logstash', 'grafana', 'prometheus',
      'sentry', 'datadog', 'newrelic', 'splunk',
      'jira', 'confluence', 'trello', 'asana', 'notion', 'monday',
      'figma', 'sketch', 'invision', 'zeplin', 'storybook',
      'cypress', 'playwright', 'puppeteer', 'selenium', 'jest', 'mocha',
      'chai', 'sinon', 'vitest', 'ava', 'tap', 'supertest',
      'lodash', 'underscore', 'ramda', 'rxjs', 'dayjs', 'luxon', 'moment',
      'axios', 'fetch', 'got', 'superagent', 'ky',
      'express', 'fastify', 'koa', 'hapi', 'nestjs', 'adonis',
      'django', 'flask', 'fastapi', 'rails', 'laravel', 'spring',
      'pytorch', 'tensorflow', 'numpy', 'pandas', 'scipy',
      'openai', 'anthropic', 'langchain', 'llamaindex',
      'wasm', 'webgl', 'webgpu', 'webrtc', 'webxr',
      'rss', 'atom', 'opml',
      'dkim', 'spf', 'dmarc',
      'oidc', 'pkce', 'jwks', 'jwe', 'jws',
      'csp', 'hsts', 'xss', 'sqli',
      'waf', 'ddos', 'mitm', 'xsrf',
      'semver', 'polyrepo',
      'kanban', 'scrum', 'agile', 'waterfall', 'sre',
      'itil', 'itsm', 'cmdb', 'sla', 'slo', 'sli',
      'kpi', 'okr', 'roi', 'cto', 'ceo', 'cfo', 'coo', 'ciso',
      'saas', 'paas', 'iaas', 'faas', 'baas', 'dbaas',
      'etl', 'elt', 'olap', 'oltp', 'dwh',
      'erd', 'uml', 'bpmn', 'dfd',
      'mmp', 'ga', 'beta', 'alpha', 'rc',
      'lts', 'eol', 'eos',
      'iso', 'ieee', 'rfc', 'w3c', 'ietf', 'ecma',
      'gdpr', 'ccpa', 'hipaa', 'sox', 'pci', 'ferpa',
      'aria', 'wcag', 'vpat',
      'canvas',
      'ux', 'ui', 'hci', 'ia',
      'seo', 'sem', 'cro', 'cta', 'cpc', 'cpm', 'ctr',
      'crm', 'erp', 'hrm', 'hris', 'ats',
      'b2b', 'b2c', 'c2c', 'd2c',
      'dhcp', 'arp', 'icmp',
      'sftp', 'scp',
      'nfs', 'smb', 'cifs', 'iscsi',
      'raid', 'lvm', 'zfs', 'btrfs', 'ext4', 'ntfs', 'apfs',
      'vm', 'vps', 'lxc', 'lxd', 'qemu', 'kvm', 'xen', 'hyperv',
      'k8s', 'eks', 'aks', 'gke', 'ecs', 'fargate',
      'lambda', 'cloudflare', 'akamai', 'fastly',
      'sns', 'sqs', 'kinesis', 'pubsub', 'eventbridge',
      's3', 'gcs', 'blob', 'r2', 'minio',
      'iam', 'rbac', 'abac', 'acl',
      'gitops', 'argocd', 'flux',
      'helm', 'kustomize', 'skaffold', 'tilt',
      'istio', 'envoy', 'linkerd', 'consul',
      'vault', 'keycloak', 'auth0', 'okta', 'cognito',
      'twilio', 'sendgrid', 'mailgun', 'ses',
      'stripe', 'paypal', 'braintree', 'adyen',
      'algolia', 'meilisearch', 'typesense', 'solr',
      'contentful', 'sanity', 'strapi', 'directus', 'ghost',
      'wordpress', 'drupal', 'joomla', 'magento', 'shopify',
      'xogo', 'sharepoint', 'onedrive', 'onenote', 'outlook',
      'powerbi', 'powerautomate', 'powerapps',
      // Acronyms that should be uppercase (handled by acronym check)
      'it', 'hr', 'pcg', 'sop', 'sops',
    ]);

    // Acronyms that should always be fully uppercase
    this.uppercaseAcronyms = new Set([
      'it', 'hr', 'pcg', 'sop', 'sops', 'api', 'ui', 'ux', 'id', 'ids',
      'url', 'urls', 'uri', 'uris', 'sql', 'css', 'html', 'xml', 'json',
      'pdf', 'csv', 'faq', 'faqs', 'kpi', 'kpis', 'roi', 'roi',
      'ceo', 'cfo', 'cto', 'coo', 'ciso', 'vp',
      'sla', 'slas', 'slo', 'sli',
      'crm', 'erp', 'hrm', 'hris',
      'gdpr', 'ccpa', 'hipaa',
      'dns', 'ssl', 'tls', 'ssh', 'ftp', 'tcp', 'udp', 'vpn',
      'aws', 'gcp', 'cdn', 'cms',
      'bcp', 'drp',
    ]);

    // Small words that should stay lowercase in titles (unless first/last word)
    this.lowercaseWords = new Set([
      'a', 'an', 'the', 'and', 'but', 'or', 'nor', 'for', 'yet', 'so',
      'in', 'on', 'at', 'to', 'by', 'of', 'up', 'as', 'is',
      'if', 'no', 'not', 'with', 'from', 'into', 'over', 'upon',
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

    // 2. APOSTROPHE CHECK — detect incorrect possessive apostrophes in plurals/acronyms
    const apostropheMatches = name.match(/\b([A-Za-z]+)'s\b/g);
    if (apostropheMatches) {
      for (const match of apostropheMatches) {
        const baseWord = match.replace(/'s$/, '');
        const lower = baseWord.toLowerCase();

        // Check if it's an acronym being incorrectly pluralised with apostrophe
        if (this.uppercaseAcronyms.has(lower) || /^[A-Z]{2,}$/.test(baseWord)) {
          const fixedPlural = baseWord.toUpperCase() + 's';
          const suggestion = name.replace(match, fixedPlural);
          issues.push({
            id: ++this.issueId,
            path,
            original: name,
            message: `"${match}" — plural acronyms don't use apostrophes`,
            suggestion,
            severity: 'warning',
            category: 'Grammar'
          });
        }

        // Check common nouns that are often incorrectly given possessive apostrophes
        // when they should be simple plurals (e.g., Cafe's → Cafes)
        const pluralMistakes = {
          "cafe's": 'Cafes', "cafes's": 'Cafes',
          "photo's": 'Photos', "video's": 'Videos',
          "memo's": 'Memos', "logo's": 'Logos',
          "portfolio's": 'Portfolios', "scenario's": 'Scenarios',
          "studio's": 'Studios', "ratio's": 'Ratios',
          "zero's": 'Zeros', "hero's": 'Heroes',
          "potato's": 'Potatoes', "tomato's": 'Tomatoes',
          "volcano's": 'Volcanoes', "echo's": 'Echoes',
          "piano's": 'Pianos', "radio's": 'Radios',
          "criteria's": 'Criteria', "data's": 'Data',
          "media's": 'Media', "agenda's": 'Agendas',
          "formula's": 'Formulas', "antenna's": 'Antennas',
        };

        const matchLower = match.toLowerCase();
        if (pluralMistakes[matchLower]) {
          const suggestion = name.replace(match, pluralMistakes[matchLower]);
          issues.push({
            id: ++this.issueId,
            path,
            original: name,
            message: `"${match}" — should be plural, not possessive`,
            suggestion,
            severity: 'warning',
            category: 'Grammar'
          });
        }
      }
    }

    // 3. ACRONYM CASE CHECK — known acronyms should be fully uppercase
    for (const word of words) {
      const lower = word.toLowerCase();
      if (this.uppercaseAcronyms.has(lower) && word !== word.toUpperCase()) {
        // Only flag if the word is clearly meant as an acronym (not part of a longer word)
        if (word.length <= 5) {
          const suggestion = name.replace(
            new RegExp(`\\b${word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`),
            word.toUpperCase()
          );
          if (suggestion !== name) {
            issues.push({
              id: ++this.issueId,
              path,
              original: name,
              message: `"${word}" should be uppercase "${word.toUpperCase()}"`,
              suggestion,
              severity: 'info',
              category: 'Convention'
            });
          }
        }
      }
    }

    // 4. NAMING CONVENTION CHECKS

    // Capitalisation check for folders — each word should be capitalised
    if (isFolder && !name.startsWith('.')) {
      const capitalised = this._capitaliseWords(name);
      if (capitalised !== name) {
        // Don't flag if we already flagged an acronym issue for the same difference
        const acronymIssue = issues.find(i =>
          i.original === name && i.category === 'Convention' &&
          i.message.includes('should be uppercase')
        );
        if (!acronymIssue || capitalised !== acronymIssue.suggestion) {
          issues.push({
            id: ++this.issueId,
            path,
            original: name,
            message: 'Words should be capitalised',
            suggestion: capitalised,
            severity: 'info',
            category: 'Convention'
          });
        }
      }
    }

    // Check for mixed naming conventions (hyphens mixed with underscores)
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

    // Check for leading/trailing hyphens or underscores (except dotfiles)
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
          !name.endsWith('.d.cts') && !name.endsWith('.test.tsx') &&
          !name.endsWith('.test.jsx') && !name.endsWith('.spec.tsx') &&
          !name.endsWith('.spec.jsx') && !name.endsWith('.config.cjs') &&
          !name.endsWith('.config.mts') && !name.endsWith('.config.cts') &&
          !name.endsWith('.module.ts') && !name.endsWith('.module.js') &&
          !name.endsWith('.setup.js') && !name.endsWith('.setup.ts') &&
          !name.endsWith('.global.css') && !name.endsWith('.global.scss')) {
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

    // Check for spaces in file names (not folders)
    if (!isFolder && /\s/.test(name)) {
      const fixed = name.replace(/\s+/g, '-');
      issues.push({
        id: ++this.issueId,
        path,
        original: name,
        message: 'File name contains spaces — use hyphens or underscores',
        suggestion: fixed,
        severity: 'warning',
        category: 'Convention'
      });
    }

    // Check for uppercase file extensions
    if (!isFolder && extension && extension !== extension.toLowerCase() && this.knownExtensions.has(extension.toLowerCase())) {
      const fixed = baseName + '.' + extension.toLowerCase();
      issues.push({
        id: ++this.issueId,
        path,
        original: name,
        message: 'File extension should be lowercase',
        suggestion: fixed,
        severity: 'info',
        category: 'Convention'
      });
    }

    return issues;
  }

  _capitaliseWords(name) {
    // Split by spaces, hyphens, and underscores while preserving the separators
    const parts = name.split(/(\s+|-|_)/);

    const capitalised = parts.map((part, index) => {
      // Preserve separators as-is
      if (/^(\s+|-|_)$/.test(part)) return part;

      // Skip empty parts
      if (part.length === 0) return part;

      // Skip numbers
      if (/^\d+$/.test(part)) return part;

      // Skip known technical terms (keep them as-is)
      if (this.knownTerms.has(part.toLowerCase())) return part;

      // If it's a known uppercase acronym, make it fully uppercase
      if (this.uppercaseAcronyms.has(part.toLowerCase())) return part.toUpperCase();

      // Find the actual word positions (first and last non-separator)
      const wordParts = parts.filter(p => !/^(\s+|-|_)$/.test(p) && p.length > 0);
      const isFirst = wordParts[0] === part && index <= 1;
      const isLast = wordParts[wordParts.length - 1] === part;

      // Small words stay lowercase unless first or last
      if (!isFirst && !isLast && this.lowercaseWords.has(part.toLowerCase())) {
        return part.toLowerCase();
      }

      // Capitalise first letter
      return part.charAt(0).toUpperCase() + part.slice(1);
    });

    return capitalised.join('');
  }

  _extractWords(name) {
    // Split by common separators: hyphens, underscores, dots, camelCase, and strip numbering prefixes
    return name
      .replace(/^\d+[\.\)\-]\s*/, '') // Strip leading number prefixes like "1. " or "2) " or "3- "
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
