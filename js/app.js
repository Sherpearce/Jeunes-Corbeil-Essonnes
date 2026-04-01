/* ============================================================
   Direction de la Jeunesse – Corbeil-Essonnes
   Main application script
   ============================================================ */

'use strict';

/* ---------- Navigation helpers ---------- */

function showHome() {
  switchPage('home');
  document.getElementById('breadcrumb').hidden = true;
  document.getElementById('breadcrumb-current').textContent = '';
}

function showConnexion() {
  switchPage('connexion');
  const bc = document.getElementById('breadcrumb');
  bc.hidden = false;
  document.getElementById('breadcrumb-current').textContent = 'Espace Ambassadeur';
}

/* ---------- Connexion / Login ---------- */

function submitConnexion(event) {
  event.preventDefault();
  const form = event.target;
  if (!form.checkValidity()) {
    form.reportValidity();
    return;
  }

  const email = document.getElementById('login-email').value.trim();
  const password = document.getElementById('login-password').value;

  // Demo validation - in production this would be an API call
  // For demo purposes, accept any email format and password length > 3
  if (email && password.length > 3) {
    form.hidden = true;
    document.getElementById('connexion-error').hidden = true;
    document.getElementById('connexion-success').hidden = false;
    window.scrollTo({ top: 0, behavior: 'smooth' });
    // Store ambassador session
    sessionStorage.setItem('ambassadorEmail', email);
    sessionStorage.setItem('ambassadorLoggedIn', 'true');
  } else {
    document.getElementById('connexion-error').hidden = false;
  }
}

/* ---------- Navigation helpers ---------- */

/**
 * @param {string} sectionKey  – One of: contact | demande | suivi | simulation
 * @param {string} label       – Breadcrumb label
 */
function showSection(sectionKey, label) {
  switchPage(sectionKey);
  const bc = document.getElementById('breadcrumb');
  bc.hidden = false;
  document.getElementById('breadcrumb-current').textContent = label;

  // Special initialisation
  if (sectionKey === 'simulation') initSimulation();
}

function switchPage(key) {
  document.querySelectorAll('.page').forEach(function (p) {
    p.hidden = true;
  });
  const target = document.getElementById('section-' + key);
  if (target) {
    target.hidden = false;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}

/* ---------- Contact form ---------- */

function submitContact(event) {
  event.preventDefault();
  const form = event.target;
  if (!form.checkValidity()) {
    form.reportValidity();
    return;
  }
  form.hidden = true;
  document.getElementById('contact-success').hidden = false;
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

/* ---------- Faire une demande – forms ---------- */

var PROGRAMS = {
  'projet-jeune': {
    icon: '💡',
    title: 'Projet Jeune',
    desc: 'Aide financière pour vos projets culturels, artistiques ou personnels (15–25 ans, domicile à Corbeil-Essonnes).',
    buildForm: buildProjetJeuneForm,
  },
  'projet-sport': {
    icon: '⚽',
    title: 'Projet Jeune Sport',
    desc: 'Soutien financier pour vos projets et événements sportifs (15–25 ans, domicile à Corbeil-Essonnes).',
    buildForm: buildProjetSportForm,
  },
  'pied-etrier': {
    icon: '🚀',
    title: 'Pied à l\'Étrier',
    desc: 'Aide à l\'insertion professionnelle, formation ou création d\'entreprise (18–25 ans, domicile à Corbeil-Essonnes).',
    buildForm: buildPiedEtrierForm,
  },
  'solidarite': {
    icon: '🤝',
    title: 'Projets Jeunes Solidarité',
    desc: 'Soutien pour vos projets solidaires, citoyens ou associatifs (15–25 ans, domicile à Corbeil-Essonnes).',
    buildForm: buildSolidariteForm,
  },
};

function showDemandeForm(programKey) {
  var prog = PROGRAMS[programKey];
  if (!prog) return;

  var inner = document.getElementById('demande-form-inner');
  inner.innerHTML = '';

  var wrap = document.createElement('div');
  wrap.className = 'demande-form-wrap';

  // Back button
  var back = document.createElement('button');
  back.className = 'demande-back';
  back.innerHTML = '← Retour';
  back.onclick = function () { showSection('demande', 'Faire une demande'); };
  wrap.appendChild(back);

  // Banner
  var banner = document.createElement('div');
  banner.className = 'program-banner';
  banner.innerHTML = '<span class="banner-icon">' + prog.icon + '</span>'
    + '<div><h2>' + prog.title + '</h2><p>' + prog.desc + '</p></div>';
  wrap.appendChild(banner);

  // Form card
  var card = document.createElement('div');
  card.className = 'form-card';
  var formEl = prog.buildForm(programKey);
  card.appendChild(formEl);
  wrap.appendChild(card);

  inner.appendChild(wrap);

  switchPage('demande-form');
  document.getElementById('breadcrumb').hidden = false;
  document.getElementById('breadcrumb-current').textContent = prog.title;
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

/* Common personal info block */
function buildPersonalFields() {
  return [
    { id: 'nom',        label: 'Nom',             type: 'text',  required: true,  autocomplete: 'family-name', placeholder: 'Votre nom' },
    { id: 'prenom',     label: 'Prénom',           type: 'text',  required: true,  autocomplete: 'given-name',  placeholder: 'Votre prénom' },
    { id: 'naissance',  label: 'Date de naissance',type: 'date',  required: true },
    { id: 'adresse',    label: 'Adresse',          type: 'text',  required: true,  autocomplete: 'street-address', placeholder: '12 rue des Lilas' },
    { id: 'codepostal', label: 'Code postal',      type: 'text',  required: true,  autocomplete: 'postal-code', placeholder: '91100' },
    { id: 'email',      label: 'Adresse e-mail',   type: 'email', required: true,  autocomplete: 'email',       placeholder: 'exemple@mail.fr' },
    { id: 'telephone',  label: 'Téléphone',        type: 'tel',   required: false, autocomplete: 'tel',         placeholder: '06 XX XX XX XX' },
  ];
}

function createField(cfg, prefix) {
  var grp = document.createElement('div');
  grp.className = 'form-group';
  var lbl = document.createElement('label');
  lbl.setAttribute('for', prefix + '-' + cfg.id);
  lbl.innerHTML = cfg.label + (cfg.required ? ' <span class="req" aria-label="obligatoire">*</span>' : '');
  grp.appendChild(lbl);

  var input;
  if (cfg.type === 'select') {
    input = document.createElement('select');
    input.id = prefix + '-' + cfg.id;
    input.name = cfg.id;
    if (cfg.required) input.required = true;
    var blank = document.createElement('option');
    blank.value = '';
    blank.textContent = '— Sélectionnez —';
    input.appendChild(blank);
    cfg.options.forEach(function (opt) {
      var o = document.createElement('option');
      o.value = opt.value;
      o.textContent = opt.label;
      input.appendChild(o);
    });
  } else if (cfg.type === 'textarea') {
    input = document.createElement('textarea');
    input.id = prefix + '-' + cfg.id;
    input.name = cfg.id;
    input.rows = cfg.rows || 4;
    if (cfg.required) input.required = true;
    if (cfg.placeholder) input.placeholder = cfg.placeholder;
  } else {
    input = document.createElement('input');
    input.type = cfg.type;
    input.id = prefix + '-' + cfg.id;
    input.name = cfg.id;
    if (cfg.required) input.required = true;
    if (cfg.placeholder) input.placeholder = cfg.placeholder;
    if (cfg.autocomplete) input.autocomplete = cfg.autocomplete;
  }
  grp.appendChild(input);
  if (cfg.hint) {
    var hint = document.createElement('small');
    hint.className = 'form-hint';
    hint.textContent = cfg.hint;
    grp.appendChild(hint);
  }
  return grp;
}

function buildSectionTitle(text) {
  var t = document.createElement('p');
  t.className = 'form-section-title';
  t.textContent = text;
  return t;
}

function buildBaseForm(programKey, extraFields) {
  var form = document.createElement('form');
  form.className = 'form';
  var prefix = programKey;

  form.appendChild(buildSectionTitle('Informations personnelles'));

  // Personal fields in rows of 2
  var personal = buildPersonalFields();
  for (var i = 0; i < personal.length; i += 2) {
    var row = document.createElement('div');
    row.className = 'form-row';
    row.appendChild(createField(personal[i], prefix));
    if (personal[i + 1]) row.appendChild(createField(personal[i + 1], prefix));
    form.appendChild(row);
  }

  // Extra fields
  form.appendChild(buildSectionTitle('Informations sur votre projet'));
  extraFields.forEach(function (cfg, idx) {
    if (idx % 2 === 0 && extraFields[idx + 1]) {
      var row = document.createElement('div');
      row.className = 'form-row';
      row.appendChild(createField(cfg, prefix));
      row.appendChild(createField(extraFields[idx + 1], prefix));
      form.appendChild(row);
    } else if (idx % 2 === 0) {
      form.appendChild(createField(cfg, prefix));
    }
    // odd index already added in even pass
  });

  // Note and actions
  var note = document.createElement('p');
  note.className = 'form-note';
  note.innerHTML = '<span class="req">*</span> Champs obligatoires';
  form.appendChild(note);

  var actions = document.createElement('div');
  actions.className = 'form-actions';

  var submit = document.createElement('button');
  submit.type = 'submit';
  submit.className = 'btn-primary';
  submit.textContent = 'Déposer ma demande';

  var cancel = document.createElement('button');
  cancel.type = 'button';
  cancel.className = 'btn-ghost';
  cancel.textContent = 'Annuler';
  cancel.onclick = function () { showSection('demande', 'Faire une demande'); };

  actions.appendChild(submit);
  actions.appendChild(cancel);
  form.appendChild(actions);

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (!form.checkValidity()) { form.reportValidity(); return; }
    showDemandeSuccess(PROGRAMS[programKey].title);
  });

  return form;
}

function buildProjetJeuneForm(programKey) {
  return buildBaseForm(programKey, [
    { id: 'type-projet',    label: 'Type de projet', type: 'select', required: true, options: [
        { value: 'culturel',   label: 'Culturel / Artistique' },
        { value: 'voyage',     label: 'Voyage découverte' },
        { value: 'formation',  label: 'Formation / Permis' },
        { value: 'numerique',  label: 'Numérique / Création' },
        { value: 'autre',      label: 'Autre' },
    ]},
    { id: 'titre',          label: 'Titre du projet', type: 'text', required: true, placeholder: 'Ex. : Création d\'un court-métrage' },
    { id: 'description',    label: 'Description du projet', type: 'textarea', required: true, placeholder: 'Décrivez votre projet en quelques lignes…' },
    { id: 'date-realisation', label: 'Date de réalisation prévue', type: 'date', required: true },
    { id: 'budget',         label: 'Budget total estimé (€)', type: 'number', required: true, placeholder: '500' },
    { id: 'aide',           label: 'Montant de l\'aide demandée (€)', type: 'number', required: true, placeholder: '300' },
    { id: 'structure',      label: 'Êtes-vous accompagné(e) par une structure ?', type: 'text', required: false, placeholder: 'Ex. : MJC, association…' },
  ]);
}

function buildProjetSportForm(programKey) {
  return buildBaseForm(programKey, [
    { id: 'discipline',     label: 'Discipline sportive', type: 'text', required: true, placeholder: 'Ex. : Football, Natation, Judo…' },
    { id: 'club',           label: 'Club / Association', type: 'text', required: false, placeholder: 'Nom de votre club' },
    { id: 'evenement',      label: 'Compétition / Événement visé', type: 'text', required: true, placeholder: 'Ex. : Championnat régional' },
    { id: 'description',    label: 'Description du projet', type: 'textarea', required: true, placeholder: 'Décrivez votre projet ou événement sportif…' },
    { id: 'date',           label: 'Date de l\'événement', type: 'date', required: true },
    { id: 'budget',         label: 'Budget total estimé (€)', type: 'number', required: true, placeholder: '400' },
    { id: 'aide',           label: 'Montant de l\'aide demandée (€)', type: 'number', required: true, placeholder: '200' },
    { id: 'niveau',         label: 'Niveau de compétition', type: 'select', required: false, options: [
        { value: 'local',       label: 'Local / Départemental' },
        { value: 'regional',    label: 'Régional' },
        { value: 'national',    label: 'National' },
        { value: 'international', label: 'International' },
    ]},
  ]);
}

function buildPiedEtrierForm(programKey) {
  return buildBaseForm(programKey, [
    { id: 'situation',      label: 'Situation actuelle', type: 'select', required: true, options: [
        { value: 'etudiant',   label: 'Étudiant(e)' },
        { value: 'apprenti',   label: 'Apprenti(e)' },
        { value: 'demandeur',  label: 'Demandeur(euse) d\'emploi' },
        { value: 'salarie',    label: 'Salarié(e)' },
        { value: 'autre',      label: 'Autre' },
    ]},
    { id: 'type-projet',    label: 'Type de projet professionnel', type: 'select', required: true, options: [
        { value: 'emploi',        label: 'Accès à l\'emploi' },
        { value: 'formation',     label: 'Formation qualifiante / Diplôme' },
        { value: 'permis',        label: 'Permis de conduire' },
        { value: 'creation',      label: 'Création d\'entreprise' },
        { value: 'alternance',    label: 'Alternance / Apprentissage' },
        { value: 'autre',         label: 'Autre' },
    ]},
    { id: 'employeur',      label: 'Employeur / Établissement / Organisme', type: 'text', required: false, placeholder: 'Nom de l\'organisme' },
    { id: 'intitule',       label: 'Intitulé du poste / de la formation', type: 'text', required: true, placeholder: 'Ex. : BTS Informatique' },
    { id: 'date-debut',     label: 'Date de début', type: 'date', required: true },
    { id: 'frais',          label: 'Frais / Coût total (€)', type: 'number', required: true, placeholder: '1200' },
    { id: 'aide',           label: 'Montant de l\'aide demandée (€)', type: 'number', required: true, placeholder: '500' },
    { id: 'description',    label: 'Description de votre projet professionnel', type: 'textarea', required: true, placeholder: 'Expliquez votre démarche et comment cette aide vous sera utile…' },
  ]);
}

function buildSolidariteForm(programKey) {
  return buildBaseForm(programKey, [
    { id: 'type-action',    label: 'Type d\'action solidaire', type: 'select', required: true, options: [
        { value: 'benevolat',   label: 'Bénévolat / Action citoyenne' },
        { value: 'humanitaire', label: 'Mission humanitaire' },
        { value: 'environnement', label: 'Environnement / Écologie' },
        { value: 'social',      label: 'Action sociale / Aide aux personnes' },
        { value: 'international', label: 'Projet international / Solidarité' },
        { value: 'autre',       label: 'Autre' },
    ]},
    { id: 'titre',          label: 'Titre du projet', type: 'text', required: true, placeholder: 'Ex. : Maraude solidaire' },
    { id: 'association',    label: 'Association partenaire', type: 'text', required: false, placeholder: 'Nom de l\'association' },
    { id: 'beneficiaires',  label: 'Nombre estimé de bénéficiaires', type: 'number', required: false, placeholder: '50' },
    { id: 'description',    label: 'Description du projet', type: 'textarea', required: true, placeholder: 'Décrivez votre projet et ses objectifs…' },
    { id: 'date-debut',     label: 'Date de début', type: 'date', required: true },
    { id: 'budget',         label: 'Budget total estimé (€)', type: 'number', required: true, placeholder: '300' },
    { id: 'aide',           label: 'Montant de l\'aide demandée (€)', type: 'number', required: true, placeholder: '200' },
  ]);
}

function showDemandeSuccess(programTitle) {
  var inner = document.getElementById('demande-form-inner');
  inner.innerHTML = '';

  var wrap = document.createElement('div');
  wrap.className = 'demande-form-wrap';

  var back = document.createElement('button');
  back.className = 'demande-back';
  back.innerHTML = '← Retour à l\'accueil';
  back.onclick = showHome;
  wrap.appendChild(back);

  var card = document.createElement('div');
  card.className = 'form-card';
  card.innerHTML = '<div class="alert-success">'
    + '<strong>✅ Votre demande a bien été enregistrée !</strong>'
    + '<p>Votre dossier <strong>' + programTitle + '</strong> a été transmis à la Direction de la Jeunesse de Corbeil-Essonnes.</p>'
    + '<p>Un accusé de réception vous sera envoyé par e-mail avec votre <strong>numéro de dossier</strong> (format CE-AAAA-XXXX).</p>'
    + '<p>Le traitement de votre dossier prend généralement entre 2 et 4 semaines. Vous pouvez suivre son avancement depuis la page <em>Suivre ma demande</em>.</p>'
    + '<button class="btn-primary" onclick="showHome()">Retour à l\'accueil</button>'
    + '</div>';
  wrap.appendChild(card);
  inner.appendChild(wrap);

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

/* ---------- Suivre ma demande ---------- */

/* Demo data – in production this would be an API call */
var DEMO_DOSSIERS = {
  'CE-2024-0001': { program: 'Projet Jeune',           status: 'approved',  label: 'Accepté',             date: '15/11/2024', agent: 'Service Jeunesse', note: 'Votre dossier a été accepté. Vous serez contacté(e) sous 10 jours pour la remise du chèque.' },
  'CE-2024-0012': { program: 'Projet Jeune Sport',     status: 'review',    label: 'En cours d\'examen',  date: '02/12/2024', agent: 'Service Jeunesse', note: 'Votre dossier est en cours d\'instruction par notre équipe.' },
  'CE-2024-0034': { program: 'Pied à l\'Étrier',       status: 'received',  label: 'Reçu',                date: '20/12/2024', agent: 'Service Jeunesse', note: 'Votre dossier a bien été reçu. Il sera examiné lors de la prochaine commission.' },
  'CE-2024-0056': { program: 'Projets Jeunes Solidarité', status: 'complete', label: 'Versement effectué', date: '05/11/2024', agent: 'Service Jeunesse', note: 'L\'aide a été versée sur votre compte. Merci pour votre engagement !' },
  'CE-2024-0099': { program: 'Projet Jeune',           status: 'rejected',  label: 'Non éligible',        date: '10/11/2024', agent: 'Service Jeunesse', note: 'Votre dossier n\'a pas pu être retenu. N\'hésitez pas à nous contacter pour plus d\'informations.' },
};

var STATUS_CLASSES = {
  received: 'status-received',
  review:   'status-review',
  approved: 'status-approved',
  rejected: 'status-rejected',
  complete: 'status-complete',
};

function suivreDossier(event) {
  event.preventDefault();
  var form = event.target;
  if (!form.checkValidity()) { form.reportValidity(); return; }

  var raw = document.getElementById('s-numero').value.trim().toUpperCase();
  var resultDiv = document.getElementById('suivi-result');
  resultDiv.hidden = false;

  var dossier = DEMO_DOSSIERS[raw];

  if (!dossier) {
    resultDiv.innerHTML = '<div class="alert-error">'
      + '<strong>❌ Dossier introuvable</strong>'
      + '<p>Aucun dossier ne correspond au numéro <strong>' + escapeHtml(raw) + '</strong>.</p>'
      + '<p>Vérifiez le numéro (format CE-AAAA-XXXX) ou contactez-nous si le problème persiste.</p>'
      + '</div>';
    return;
  }

  var cls = STATUS_CLASSES[dossier.status] || '';
  resultDiv.innerHTML = '<div class="alert-info">'
    + '<strong>📁 Dossier ' + escapeHtml(raw) + '</strong>'
    + '<div class="suivi-details">'
    + '<dt>Dispositif</dt><dd>' + escapeHtml(dossier.program) + '</dd>'
    + '<dt>Statut</dt><dd><span class="status-badge ' + cls + '">' + escapeHtml(dossier.label) + '</span></dd>'
    + '<dt>Dernière mise à jour</dt><dd>' + escapeHtml(dossier.date) + '</dd>'
    + '<dt>Informations</dt><dd>' + escapeHtml(dossier.note) + '</dd>'
    + '</div></div>';
}

/* ---------- Simulation / Eligibility checker ---------- */

var SIM_ANSWERS = {};
var SIM_STEP = 0;

var SIM_STEPS = [
  {
    id: 'age',
    question: 'Quel est votre âge ?',
    type: 'choice',
    options: [
      { value: 'moins16', label: 'Moins de 16 ans', icon: '🧒' },
      { value: '16_17',   label: '16 à 17 ans',     icon: '🎒' },
      { value: '18_25',   label: '18 à 25 ans',     icon: '🎓' },
      { value: 'plus25',  label: 'Plus de 25 ans',  icon: '👤' },
    ],
  },
  {
    id: 'residence',
    question: 'Habitez-vous à Corbeil-Essonnes ?',
    type: 'choice',
    options: [
      { value: 'oui', label: 'Oui, je suis domicilié(e) à Corbeil-Essonnes', icon: '✅' },
      { value: 'non', label: 'Non, je réside dans une autre commune',         icon: '❌' },
    ],
  },
  {
    id: 'statut',
    question: 'Quelle est votre situation actuelle ?',
    type: 'choice',
    options: [
      { value: 'lyceen',    label: 'Lycéen(ne)',                       icon: '📚' },
      { value: 'etudiant',  label: 'Étudiant(e) dans le supérieur',   icon: '🎓' },
      { value: 'apprenti',  label: 'Apprenti(e) / Alternant(e)',      icon: '🔧' },
      { value: 'demandeur', label: 'Demandeur(euse) d\'emploi',       icon: '💼' },
      { value: 'salarie',   label: 'Salarié(e)',                      icon: '👔' },
      { value: 'autre',     label: 'Autre situation',                  icon: '➕' },
    ],
  },
  {
    id: 'type_projet',
    question: 'Quel type de projet souhaitez-vous réaliser ?',
    type: 'choice',
    options: [
      { value: 'culturel',    label: 'Culturel / Artistique / Voyage',            icon: '🎨' },
      { value: 'sportif',     label: 'Sportif',                                   icon: '⚽' },
      { value: 'professionnel', label: 'Professionnel / Formation / Entrepreneuriat', icon: '🚀' },
      { value: 'solidaire',   label: 'Solidaire / Citoyen / Associatif',          icon: '🤝' },
      { value: 'non_defini',  label: 'Mon projet n\'est pas encore défini',       icon: '🤔' },
    ],
  },
  {
    id: 'budget',
    question: 'Quel est le budget estimé de votre projet ?',
    type: 'choice',
    options: [
      { value: 'moins200',  label: 'Moins de 200 €',      icon: '💶' },
      { value: '200_500',   label: 'De 200 € à 500 €',    icon: '💶' },
      { value: '500_1500',  label: 'De 500 € à 1 500 €',  icon: '💶' },
      { value: 'plus1500',  label: 'Plus de 1 500 €',     icon: '💶' },
    ],
  },
  {
    id: 'aide_prec',
    question: 'Avez-vous déjà bénéficié d\'une aide jeunesse de la ville de Corbeil-Essonnes au cours des 12 derniers mois ?',
    type: 'choice',
    options: [
      { value: 'non', label: 'Non', icon: '🆕' },
      { value: 'oui', label: 'Oui', icon: '🔄' },
    ],
  },
];

function initSimulation() {
  SIM_ANSWERS = {};
  SIM_STEP = 0;
  renderSimStep();
}

function renderSimStep() {
  var inner = document.getElementById('simulation-inner');

  // Check early exits
  if (SIM_STEP > 0) {
    if (SIM_ANSWERS['age'] === 'moins15' || SIM_ANSWERS['age'] === 'plus25') {
      renderSimIneligible('Votre âge ne correspond pas aux critères des dispositifs jeunesse (15–25 ans).');
      return;
    }
    if (SIM_ANSWERS['residence'] === 'non') {
      renderSimIneligible('Vous devez être domicilié(e) à Corbeil-Essonnes pour bénéficier des dispositifs jeunesse.');
      return;
    }
  }

  if (SIM_STEP >= SIM_STEPS.length) {
    renderSimResults();
    return;
  }

  var step = SIM_STEPS[SIM_STEP];
  var total = SIM_STEPS.length;

  var html = '<div class="sim-step" role="form" aria-label="' + escapeHtml(step.question) + '">'
    + '<p class="sim-progress">Étape ' + (SIM_STEP + 1) + ' sur ' + total + '</p>'
    + '<p class="sim-question">' + escapeHtml(step.question) + '</p>'
    + '<div class="sim-options" id="sim-opts">';

  step.options.forEach(function (opt) {
    var selected = SIM_ANSWERS[step.id] === opt.value ? ' selected' : '';
    html += '<button type="button" class="sim-option' + selected + '" '
      + 'data-step="' + escapeHtml(step.id) + '" data-value="' + escapeHtml(opt.value) + '">'
      + '<span class="sim-option-icon">' + opt.icon + '</span>'
      + escapeHtml(opt.label)
      + '</button>';
  });

  html += '</div>';
  html += '<div class="sim-nav">';
  if (SIM_STEP > 0) {
    html += '<button type="button" class="btn-secondary" onclick="simBack()">← Précédent</button>';
  }
  html += '<button type="button" class="btn-primary" id="sim-next-btn" '
    + (SIM_ANSWERS[step.id] ? '' : 'disabled ')
    + 'onclick="simNext()">Suivant →</button>';
  html += '</div></div>';

  inner.innerHTML = html;

  // Bind option clicks
  inner.querySelectorAll('.sim-option').forEach(function (btn) {
    btn.addEventListener('click', function () {
      SIM_ANSWERS[btn.dataset.step] = btn.dataset.value;
      inner.querySelectorAll('.sim-option').forEach(function (b) { b.classList.remove('selected'); });
      btn.classList.add('selected');
      document.getElementById('sim-next-btn').disabled = false;
    });
  });
}

function simNext() {
  var step = SIM_STEPS[SIM_STEP];
  if (!SIM_ANSWERS[step.id]) return;
  SIM_STEP++;
  renderSimStep();
}

function simBack() {
  if (SIM_STEP > 0) { SIM_STEP--; renderSimStep(); }
}

function renderSimIneligible(reason) {
  var inner = document.getElementById('simulation-inner');
  inner.innerHTML = '<div class="alert-error">'
    + '<strong>⛔ Vous n\'êtes pas éligible aux dispositifs jeunesse de Corbeil-Essonnes</strong>'
    + '<p>' + escapeHtml(reason) + '</p>'
    + '<p>Pour en savoir plus, n\'hésitez pas à contacter la Direction de la Jeunesse.</p>'
    + '</div>'
    + '<div class="sim-nav" style="margin-top:1rem;">'
    + '<button type="button" class="btn-secondary" onclick="simBack()">← Précédent</button>'
    + '<button type="button" class="btn-primary" onclick="showSection(\'contact\', \'Contacter la Direction de la Jeunesse\')">Nous contacter</button>'
    + '</div>';
}

function renderSimResults() {
  var age         = SIM_ANSWERS['age'];
  var statut      = SIM_ANSWERS['statut'];
  var typeProjet  = SIM_ANSWERS['type_projet'];
  var aidePrec    = SIM_ANSWERS['aide_prec'];

  var results = [];

  /* --- Projet Jeune --- */
  var pjElig = (age === '15_17' || age === '18_25')
    && (typeProjet === 'culturel' || typeProjet === 'non_defini')
    && aidePrec !== 'oui';
  var pjPartial = (age === '15_17' || age === '18_25')
    && (typeProjet === 'non_defini');

  if (pjElig || (age === '15_17' || age === '18_25')) {
    if (typeProjet === 'culturel') {
      results.push({
        key: 'projet-jeune',
        title: 'Projet Jeune',
        icon: '💡',
        eligible: true,
        desc: 'Votre profil correspond à ce dispositif. Vous pouvez déposer une demande pour financer votre projet culturel, artistique ou personnel.',
        cta: 'projet-jeune',
      });
    }
  }

  /* --- Projet Jeune Sport --- */
  if ((age === '15_17' || age === '18_25') && typeProjet === 'sportif') {
    results.push({
      key: 'projet-sport',
      title: 'Projet Jeune Sport',
      icon: '⚽',
      eligible: true,
      desc: 'Votre projet sportif correspond à ce dispositif. Vous pouvez déposer une demande de soutien.',
      cta: 'projet-sport',
    });
  }

  /* --- Pied à l'Étrier --- */
  if (age === '18_25' && typeProjet === 'professionnel') {
    results.push({
      key: 'pied-etrier',
      title: 'Pied à l\'Étrier',
      icon: '🚀',
      eligible: true,
      desc: 'Ce dispositif correspond à votre souhait d\'insertion professionnelle ou de création d\'entreprise.',
      cta: 'pied-etrier',
    });
  }

  /* --- Projets Jeunes Solidarité --- */
  if ((age === '15_17' || age === '18_25') && typeProjet === 'solidaire') {
    results.push({
      key: 'solidarite',
      title: 'Projets Jeunes Solidarité',
      icon: '🤝',
      eligible: true,
      desc: 'Votre projet solidaire ou citoyen est éligible à ce dispositif de soutien.',
      cta: 'solidarite',
    });
  }

  /* --- Generic partial matches if no direct match --- */
  if (results.length === 0 && (age === '15_17' || age === '18_25')) {
    [
      { key: 'projet-jeune',  title: 'Projet Jeune',              icon: '💡', desc: 'Sous réserve du type de votre projet (culturel, artistique, personnel).', cta: 'projet-jeune' },
      { key: 'projet-sport',  title: 'Projet Jeune Sport',        icon: '⚽', desc: 'Si votre projet est à composante sportive.', cta: 'projet-sport' },
      { key: 'pied-etrier',   title: 'Pied à l\'Étrier',          icon: '🚀', desc: 'Si vous avez un projet professionnel ou de formation (18–25 ans uniquement).', cta: 'pied-etrier' },
      { key: 'solidarite',    title: 'Projets Jeunes Solidarité', icon: '🤝', desc: 'Si votre projet est orienté solidarité ou citoyenneté.', cta: 'solidarite' },
    ].forEach(function (r) { r.partial = true; results.push(r); });
  }

  var inner = document.getElementById('simulation-inner');

  if (results.length === 0) {
    inner.innerHTML = '<div class="alert-error">'
      + '<strong>⛔ Aucun dispositif ne correspond à votre profil</strong>'
      + '<p>D\'après vos réponses, vous ne semblez pas éligible aux dispositifs Jeunes de Corbeil-Essonnes.</p>'
      + '<p>Contactez la Direction de la Jeunesse pour un examen personnalisé de votre situation.</p>'
      + '</div>'
      + '<div class="sim-nav" style="margin-top:1rem;">'
      + '<button type="button" class="btn-secondary" onclick="initSimulation()">Recommencer</button>'
      + '<button type="button" class="btn-primary" onclick="showSection(\'contact\', \'Contacter la Direction de la Jeunesse\')">Nous contacter</button>'
      + '</div>';
    return;
  }

  var html = '<div class="sim-results">'
    + '<h3>🎉 Résultats de la simulation</h3>'
    + '<p style="color:var(--text-muted); font-size:.9rem; margin-bottom:.5rem;">D\'après vos réponses, voici les dispositifs auxquels vous pourriez être éligible :</p>';

  results.forEach(function (r) {
    var tag = r.partial
      ? '<span class="tag-eligible" style="background:#fff8e1;color:#f57f17;">Potentiellement éligible</span>'
      : '<span class="tag-eligible">Éligible</span>';

    html += '<div class="result-card' + (r.partial ? ' result-card-partial' : '') + '">'
      + '<h4>' + r.icon + ' ' + escapeHtml(r.title) + ' ' + tag + '</h4>'
      + '<p>' + escapeHtml(r.desc) + '</p>'
      + (aidePrec === 'oui' ? '<p style="color:#e65100; font-size:.85rem;">⚠️ Vous avez déjà bénéficié d\'une aide cette année. Vérifiez les conditions de renouvellement.</p>' : '')
      + '<button type="button" class="btn-primary" onclick="showDemandeForm(\'' + r.cta + '\')" style="font-size:.88rem; padding:.55rem 1.2rem;">Déposer une demande →</button>'
      + '</div>';
  });

  html += '<div class="sim-nav">'
    + '<button type="button" class="btn-secondary" onclick="initSimulation()">Recommencer la simulation</button>'
    + '<button type="button" class="btn-ghost" onclick="showSection(\'contact\', \'Contacter la Direction de la Jeunesse\')">Poser une question</button>'
    + '</div>';

  html += '</div>';
  inner.innerHTML = html;
}

/* ---------- Utilities ---------- */

function escapeHtml(str) {
  var div = document.createElement('div');
  div.appendChild(document.createTextNode(String(str)));
  return div.innerHTML;
}

/* ---------- Init ---------- */
document.addEventListener('DOMContentLoaded', function () {
  showHome();
});
