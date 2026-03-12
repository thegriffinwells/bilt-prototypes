// Partner data
const partners = {
  airlines: [
    { id: 'aa', name: 'American Airlines', program: 'AAdvantage', code: 'AA', ratio: '1:1', color: '#0078D2' },
    { id: 'ua', name: 'United Airlines', program: 'MileagePlus', code: 'UA', ratio: '1:1', color: '#002244' },
    { id: 'ac', name: 'Air Canada', program: 'Aeroplan', code: 'AC', ratio: '1:1', color: '#F01428' },
    { id: 'ek', name: 'Emirates', program: 'Skywards', code: 'EK', ratio: '1:1', color: '#D71921' },
    { id: 'cx', name: 'Cathay Pacific', program: 'Asia Miles', code: 'CX', ratio: '1:1', color: '#005D63' },
    { id: 'tk', name: 'Turkish Airlines', program: 'Miles&Smiles', code: 'TK', ratio: '1:1', color: '#C8102E' },
    { id: 'af', name: 'Air France', program: 'Flying Blue', code: 'AF', ratio: '1:1', color: '#002157' },
    { id: 'sq', name: 'Singapore Air', program: 'KrisFlyer', code: 'SQ', ratio: '1:1', color: '#00295B' },
    { id: 'va', name: 'Virgin Atlantic', program: 'Flying Club', code: 'VA', ratio: '1:1', color: '#E4002B' },
  ],
  hotels: [
    { id: 'hyatt', name: 'World of Hyatt', program: 'World of Hyatt', code: 'HY', ratio: '1:1', color: '#9B6B43' },
    { id: 'ihg', name: 'IHG', program: 'IHG One Rewards', code: 'IHG', ratio: '1:2', multiplier: 2, color: '#2D2926' },
    { id: 'marriott', name: 'Marriott', program: 'Bonvoy', code: 'MB', ratio: '1:1', color: '#1C1C1C' },
  ]
};

// State
let state = {
  currentStep: 1,
  selectedPartner: null,
  points: 0,
  availablePoints: 24500,
  memberId: '',
};

// DOM refs
const steps = {
  1: document.getElementById('step1'),
  2: document.getElementById('step2'),
  3: document.getElementById('step3'),
  4: document.getElementById('step4'),
};

// Initialize partner grids
function initPartnerGrids() {
  const airlinesGrid = document.getElementById('airlinesGrid');
  const hotelsGrid = document.getElementById('hotelsGrid');

  partners.airlines.forEach(p => {
    airlinesGrid.appendChild(createPartnerCard(p));
  });

  partners.hotels.forEach(p => {
    hotelsGrid.appendChild(createPartnerCard(p));
  });
}

function createPartnerCard(partner) {
  const card = document.createElement('button');
  card.className = 'partner-card';
  card.dataset.partnerId = partner.id;
  card.innerHTML = `
    <div class="partner-logo" style="background: ${partner.color}; color: white;">
      ${partner.code}
    </div>
    <span class="partner-name">${partner.name}</span>
    <span class="partner-ratio">${partner.ratio}</span>
  `;
  card.addEventListener('click', () => selectPartner(partner));
  return card;
}

function selectPartner(partner) {
  state.selectedPartner = partner;
  goToStep(2);
}

// Step navigation
function goToStep(step) {
  steps[state.currentStep].classList.remove('step-active');
  state.currentStep = step;
  steps[step].classList.add('step-active');

  // Update toolbar title
  const titles = {
    1: 'Transfer Points',
    2: 'Enter Amount',
    3: 'Review Transfer',
    4: 'Transfer Points',
  };
  document.getElementById('toolbarTitle').textContent = titles[step];

  // Setup step content
  if (step === 2) setupStep2();
  if (step === 3) setupStep3();
  if (step === 4) setupStep4();
}

// Step 2: Amount entry
function setupStep2() {
  const partner = state.selectedPartner;
  const display = document.getElementById('selectedPartnerDisplay');
  display.innerHTML = `
    <div class="partner-logo" style="background: ${partner.color}; color: white; width: 48px; height: 48px; font-size: 14px;">
      ${partner.code}
    </div>
    <div class="selected-partner-info">
      <span class="selected-partner-name">${partner.name}</span>
      <span class="selected-partner-program body-xs">${partner.program}</span>
    </div>
  `;

  const currencyLabel = document.getElementById('partnerCurrencyLabel');
  currencyLabel.textContent = partner.program.includes('Hyatt') || partner.program.includes('IHG') || partner.program.includes('Bonvoy')
    ? 'Hotel Points' : 'Partner Miles';

  document.getElementById('conversionRate').textContent = `${partner.ratio} transfer ratio`;

  // Reset
  document.getElementById('pointsInput').value = '';
  document.getElementById('convertedAmount').textContent = '0';
  document.getElementById('reviewBtn').disabled = true;
  state.points = 0;

  // Clear active quick amounts
  document.querySelectorAll('.quick-amount-btn').forEach(b => b.classList.remove('active'));
}

// Step 3: Review
function setupStep3() {
  const partner = state.selectedPartner;
  const multiplier = partner.multiplier || 1;
  const partnerPoints = state.points * multiplier;

  document.getElementById('reviewPartnerIcon').innerHTML = `
    <div style="background: ${partner.color}; color: white; width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; border-radius: 8px; font-size: 12px; font-weight: 460;">
      ${partner.code}
    </div>
  `;
  document.getElementById('reviewPartnerName').textContent = partner.name;
  document.getElementById('reviewPartnerProgram').textContent = partner.program;
  document.getElementById('reviewBiltPoints').textContent = formatNumber(state.points);
  document.getElementById('reviewRatio').textContent = partner.ratio;
  document.getElementById('reviewPartnerPoints').textContent = formatNumber(partnerPoints);
  document.getElementById('reviewTotal').textContent = `${formatNumber(partnerPoints)} ${multiplier > 1 ? 'points' : 'miles'}`;
  document.getElementById('reviewMilesLabel').textContent =
    partner.program.includes('Hyatt') || partner.program.includes('IHG') || partner.program.includes('Bonvoy')
      ? 'Hotel Points' : 'Partner Miles';

  // Reset member ID
  document.getElementById('memberIdInput').value = '';
  document.getElementById('confirmBtn').disabled = true;
}

// Step 4: Confirmation
function setupStep4() {
  const partner = state.selectedPartner;
  const multiplier = partner.multiplier || 1;
  const partnerPoints = state.points * multiplier;

  document.getElementById('confirmationDesc').textContent =
    `${formatNumber(state.points)} Bilt Points are being transferred to your ${partner.program} account as ${formatNumber(partnerPoints)} ${multiplier > 1 ? 'points' : 'miles'}.`;

  document.getElementById('confirmRef').textContent = 'TRF-' + generateRef();
}

// Helpers
function formatNumber(num) {
  return num.toLocaleString('en-US');
}

function generateRef() {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

// Event handlers
document.getElementById('backBtn').addEventListener('click', () => {
  if (state.currentStep > 1) {
    goToStep(state.currentStep - 1);
  }
});

// Points input
const pointsInput = document.getElementById('pointsInput');
pointsInput.addEventListener('input', (e) => {
  let raw = e.target.value.replace(/[^0-9]/g, '');
  let num = parseInt(raw, 10) || 0;

  if (num > state.availablePoints) {
    num = state.availablePoints;
    pointsInput.classList.add('error');
    setTimeout(() => pointsInput.classList.remove('error'), 600);
  }

  state.points = num;
  e.target.value = num > 0 ? formatNumber(num) : '';

  const multiplier = state.selectedPartner?.multiplier || 1;
  document.getElementById('convertedAmount').textContent = formatNumber(num * multiplier);
  document.getElementById('reviewBtn').disabled = num === 0;

  // Update quick amount active state
  document.querySelectorAll('.quick-amount-btn').forEach(btn => {
    btn.classList.toggle('active', parseInt(btn.dataset.amount) === num);
  });
});

// Use All button
document.getElementById('useAllBtn').addEventListener('click', () => {
  state.points = state.availablePoints;
  pointsInput.value = formatNumber(state.availablePoints);
  const multiplier = state.selectedPartner?.multiplier || 1;
  document.getElementById('convertedAmount').textContent = formatNumber(state.availablePoints * multiplier);
  document.getElementById('reviewBtn').disabled = false;
  document.querySelectorAll('.quick-amount-btn').forEach(b => b.classList.remove('active'));
});

// Quick amount buttons
document.querySelectorAll('.quick-amount-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const amount = parseInt(btn.dataset.amount);
    if (amount > state.availablePoints) return;

    state.points = amount;
    pointsInput.value = formatNumber(amount);
    const multiplier = state.selectedPartner?.multiplier || 1;
    document.getElementById('convertedAmount').textContent = formatNumber(amount * multiplier);
    document.getElementById('reviewBtn').disabled = false;

    document.querySelectorAll('.quick-amount-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
  });
});

// Review button
document.getElementById('reviewBtn').addEventListener('click', () => {
  goToStep(3);
});

// Member ID input
document.getElementById('memberIdInput').addEventListener('input', (e) => {
  document.getElementById('confirmBtn').disabled = e.target.value.trim().length === 0;
});

// Confirm button
document.getElementById('confirmBtn').addEventListener('click', () => {
  goToStep(4);
});

// Done button
document.getElementById('doneBtn').addEventListener('click', () => {
  state.selectedPartner = null;
  state.points = 0;
  goToStep(1);
});

// Another transfer button
document.getElementById('anotherTransferBtn').addEventListener('click', () => {
  state.selectedPartner = null;
  state.points = 0;
  goToStep(1);
});

// Search
document.getElementById('searchInput').addEventListener('input', (e) => {
  const query = e.target.value.toLowerCase();
  document.querySelectorAll('.partner-card').forEach(card => {
    const name = card.querySelector('.partner-name').textContent.toLowerCase();
    card.style.display = name.includes(query) ? '' : 'none';
  });
});

// Init
initPartnerGrids();

// Responsive phone frame scaling
function scaleFrame() {
  const frame = document.querySelector('.phone-frame');
  if (!frame) return;
  const sx = (window.innerWidth - 60) / 410;
  const sy = (window.innerHeight - 60) / 882;
  frame.style.setProperty('--frame-scale', Math.min(1, sx, sy));
}
window.addEventListener('resize', scaleFrame);
scaleFrame();
