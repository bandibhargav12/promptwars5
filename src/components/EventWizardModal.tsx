import React, { useState } from 'react';
import { EventType, CelebrationEvent } from '../types/event';
import { Sparkles, X, Heart, Cake, Users2, Compass, Loader2, ArrowRight, Check } from 'lucide-react';

interface EventWizardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEventCreated: (newEvent: CelebrationEvent) => void;
}

export const EventWizardModal: React.FC<EventWizardModalProps> = ({
  isOpen,
  onClose,
  onEventCreated,
}) => {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  // Form State
  const [eventType, setEventType] = useState<EventType>('wedding');
  const [title, setTitle] = useState('Enchanted Summer Solstice Wedding');
  const [date, setDate] = useState('2026-08-22');
  const [location, setLocation] = useState('Coastal Meadow & Cliffside Pavilion');
  const [guestCount, setGuestCount] = useState<number>(110);
  const [totalBudget, setTotalBudget] = useState<number>(35000);
  const [currency, setCurrency] = useState('USD');
  const [styleVibe, setStyleVibe] = useState(
    'Warm golden hour lighting, wild ocean breezes, organic linen textures, and acoustic violin melodies.'
  );
  const [specialRequirements, setSpecialRequirements] = useState(
    'Farm-to-table vegetarian entrees, sunset toast at 7:45 PM, and eco-friendly seed-paper confetti.'
  );

  const [isLoading, setIsLoading] = useState(false);
  const [loadingStepText, setLoadingStepText] = useState('Connecting to Gemini AI...');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  // Handle Event Type Selection and preset defaults
  const handleSelectType = (type: EventType) => {
    setEventType(type);
    if (type === 'wedding') {
      setTitle('Enchanted Summer Solstice Wedding');
      setStyleVibe('Warm golden hour lighting, wild ocean breezes, organic linen textures, and acoustic violin melodies.');
      setTotalBudget(35000);
      setGuestCount(110);
    } else if (type === 'birthday') {
      setTitle('The Golden Deco 30th Soirée');
      setStyleVibe('Gatsby-inspired modern brass accents, velvet lounge seating, signature smoked bourbon cocktails, and vintage jazz.');
      setTotalBudget(14000);
      setGuestCount(55);
    } else if (type === 'community') {
      setTitle('Midsummer Waterfront Arts & Food Festival');
      setStyleVibe('Vibrant neighborhood celebration with artisan food trucks, local acoustic singer-songwriters, interactive craft booths, and fairy lights.');
      setTotalBudget(22000);
      setGuestCount(250);
    } else {
      setTitle('Private Family Reunion & Jubilee');
      setStyleVibe('Heartfelt, nostalgic, relaxed outdoor barbecue with garden games and storytelling circles.');
      setTotalBudget(8000);
      setGuestCount(45);
    }
  };

  // Submit to Server Gemini API
  const handleGenerate = async () => {
    setIsLoading(true);
    setErrorMessage(null);
    setStep(4);

    const steps = [
      'Orchestrating design theme and harmonious color swatches...',
      'Calculating category budgets and allocating line-item estimates...',
      'Sequencing preparation milestones and day-of run of show...',
      'Assembling vendor interview checklists and partner profiles...',
      'Polishing personalized master blueprint...',
    ];

    let stepIndex = 0;
    const interval = setInterval(() => {
      stepIndex = (stepIndex + 1) % steps.length;
      setLoadingStepText(steps[stepIndex]);
    }, 1800);

    try {
      const response = await fetch('/api/ai/generate-event-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventType,
          title,
          date,
          location,
          guestCount,
          totalBudget,
          currency,
          styleVibe,
          specialRequirements,
        }),
      });

      clearInterval(interval);
      const data = await response.json();

      if (!data.success || !data.plan) {
        throw new Error(data.error || 'Failed to generate event blueprint.');
      }

      const rawPlan = data.plan;

      // Construct a full CelebrationEvent object
      const newEvent: CelebrationEvent = {
        id: `event-${Date.now()}`,
        title,
        type: eventType,
        date,
        location,
        guestCount,
        totalBudget,
        currency,
        styleVibe,
        specialRequirements,
        theme: {
          title: rawPlan.theme?.title || title,
          aesthetic: rawPlan.theme?.aesthetic || styleVibe,
          atmosphere: rawPlan.theme?.atmosphere || 'Warm, celebratory, and thoughtfully curated.',
          colorPalette: rawPlan.theme?.colorPalette || [
            { name: 'Warm Gold', hex: '#D4AF37' },
            { name: 'Deep Slate', hex: '#1E293B' },
            { name: 'Ivory Cream', hex: '#FDFBF7' },
            { name: 'Rose Clay', hex: '#B45309' },
          ],
          decorConcept: rawPlan.theme?.decorConcept || 'Bespoke ambient styling and elegant tablescapes.',
          musicStyle: rawPlan.theme?.musicStyle || 'Curated acoustic and dinner celebration melodies.',
          invitationWording: rawPlan.theme?.invitationWording || `You are warmly invited to join in celebrating ${title}.`,
        },
        budget: {
          categories: (rawPlan.budget?.categories || []).map((cat: any, cIdx: number) => ({
            id: `cat-${cIdx}-${Date.now()}`,
            name: cat.name || `Category ${cIdx + 1}`,
            allocated: cat.allocated || 0,
            items: (cat.items || []).map((item: any, iIdx: number) => ({
              id: `item-${cIdx}-${iIdx}-${Date.now()}`,
              name: item.name || 'Expense Item',
              estimatedCost: item.estimatedCost || 0,
              actualCost: item.estimatedCost || 0,
              paid: false,
              notes: item.notes || '',
            })),
          })),
        },
        timeline: {
          milestones: (rawPlan.timeline?.milestones || []).map((m: any, mIdx: number) => ({
            id: `m-${mIdx}-${Date.now()}`,
            timeframe: m.timeframe || 'Preparation',
            title: m.title || 'Milestone Task',
            description: m.description || '',
            completed: false,
          })),
          dayOfSchedule: (rawPlan.timeline?.dayOfSchedule || []).map((d: any, dIdx: number) => ({
            id: `d-${dIdx}-${Date.now()}`,
            time: d.time || `${10 + dIdx}:00 AM`,
            activity: d.activity || 'Activity',
            location: d.location || location,
            leadPerson: d.leadPerson || 'Lead Coordinator',
            notes: d.notes || '',
            completed: false,
          })),
        },
        vendors: (rawPlan.vendors || []).map((v: any, vIdx: number) => ({
          id: `v-${vIdx}-${Date.now()}`,
          category: v.category || 'Production',
          name: v.name || 'Vendor Partner',
          contact: v.contact || 'Inquiry pending',
          quoteAmount: v.quoteAmount || 0,
          status: 'In Talks',
          notes: v.notes || '',
          checklist: v.checklist || ['Review contract terms', 'Confirm delivery schedule'],
        })),
        personalizedTips: rawPlan.personalizedTips || [
          'Buffer 15 minutes between speeches and dinner service for seamless crowd flow.',
          'Designate a single primary point of contact for vendor delivery arrivals.',
        ],
        createdAt: new Date().toISOString(),
      };

      onEventCreated(newEvent);
      onClose();
    } catch (err: any) {
      clearInterval(interval);
      console.error(err);
      setErrorMessage(
        err.message || 'Error communicating with Gemini AI. Please check your network and API credentials.'
      );
      setStep(3);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/70 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-2xl shadow-2xl border border-stone-200 w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Top Header */}
        <div className="px-6 py-4 border-b border-stone-100 flex items-center justify-between bg-stone-50/50">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-stone-900" style={{ fontFamily: 'var(--font-heading)' }}>
                GenAI Celebration Planner
              </h3>
              <p className="text-[11px] text-stone-500">
                Step {step} of 3 · AI Master Blueprint Generator
              </p>
            </div>
          </div>

          {!isLoading && (
            <button
              onClick={onClose}
              className="text-stone-400 hover:text-stone-700 transition-colors p-1"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {errorMessage && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700">
              {errorMessage}
            </div>
          )}

          {/* STEP 1: EVENT TYPE SELECTION */}
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <h4 className="text-base font-bold text-stone-900">
                  What kind of celebration are we planning?
                </h4>
                <p className="text-xs text-stone-500 mt-0.5">
                  Choose a celebration archetype to seed the Gemini planning model with industry-tested heuristics.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
                {/* Wedding */}
                <button
                  type="button"
                  onClick={() => handleSelectType('wedding')}
                  className={`p-4 rounded-xl border text-left transition-all ${
                    eventType === 'wedding'
                      ? 'border-amber-600 bg-amber-50/50 ring-1 ring-amber-600 shadow-xs'
                      : 'border-stone-200 hover:border-stone-300 bg-white'
                  }`}
                >
                  <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center mb-2.5">
                    <Heart className="w-4 h-4" />
                  </div>
                  <div className="text-sm font-bold text-stone-900">Wedding Celebration</div>
                  <div className="text-xs text-stone-500 mt-1">
                    Ceremonies, vows, formal banquets, floral installations, and full runs of show.
                  </div>
                </button>

                {/* Milestone Birthday */}
                <button
                  type="button"
                  onClick={() => handleSelectType('birthday')}
                  className={`p-4 rounded-xl border text-left transition-all ${
                    eventType === 'birthday'
                      ? 'border-amber-600 bg-amber-50/50 ring-1 ring-amber-600 shadow-xs'
                      : 'border-stone-200 hover:border-stone-300 bg-white'
                  }`}
                >
                  <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center mb-2.5">
                    <Cake className="w-4 h-4" />
                  </div>
                  <div className="text-sm font-bold text-stone-900">Milestone Birthday</div>
                  <div className="text-xs text-stone-500 mt-1">
                    30th, 40th, 50th, quinceañeras, rooftop soirees, DJ sets, and champagne toasts.
                  </div>
                </button>

                {/* Community Gathering */}
                <button
                  type="button"
                  onClick={() => handleSelectType('community')}
                  className={`p-4 rounded-xl border text-left transition-all ${
                    eventType === 'community'
                      ? 'border-amber-600 bg-amber-50/50 ring-1 ring-amber-600 shadow-xs'
                      : 'border-stone-200 hover:border-stone-300 bg-white'
                  }`}
                >
                  <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center mb-2.5">
                    <Users2 className="w-4 h-4" />
                  </div>
                  <div className="text-sm font-bold text-stone-900">Community Gathering</div>
                  <div className="text-xs text-stone-500 mt-1">
                    Neighborhood harvest galas, charity mixers, artisan street markets, and park festivals.
                  </div>
                </button>

                {/* Custom Celebration */}
                <button
                  type="button"
                  onClick={() => handleSelectType('custom')}
                  className={`p-4 rounded-xl border text-left transition-all ${
                    eventType === 'custom'
                      ? 'border-amber-600 bg-amber-50/50 ring-1 ring-amber-600 shadow-xs'
                      : 'border-stone-200 hover:border-stone-300 bg-white'
                  }`}
                >
                  <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center mb-2.5">
                    <Compass className="w-4 h-4" />
                  </div>
                  <div className="text-sm font-bold text-stone-900">Custom Celebration</div>
                  <div className="text-xs text-stone-500 mt-1">
                    Family reunions, retirement galas, baby showers, and bespoke anniversary dinners.
                  </div>
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: LOGISTICS & BUDGET */}
          {step === 2 && (
            <div className="space-y-4">
              <div>
                <h4 className="text-base font-bold text-stone-900">
                  Event Essentials & Scale
                </h4>
                <p className="text-xs text-stone-500 mt-0.5">
                  Define your headcount, budget ceiling, and date parameters.
                </p>
              </div>

              <div className="space-y-3.5">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Celebration Title
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs rounded-lg border border-stone-300 bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 font-medium"
                    placeholder="e.g. Maya & Ethan's Napa Vineyard Wedding"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Event Date
                    </label>
                    <input
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="w-full px-3.5 py-2 text-xs rounded-lg border border-stone-300 bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Setting / Venue
                    </label>
                    <input
                      type="text"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="w-full px-3.5 py-2 text-xs rounded-lg border border-stone-300 bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                      placeholder="e.g. Garden Pavilion or Rooftop Terrace"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Guest Count
                    </label>
                    <input
                      type="number"
                      min={5}
                      max={5000}
                      value={guestCount}
                      onChange={(e) => setGuestCount(Number(e.target.value))}
                      className="w-full px-3.5 py-2 text-xs rounded-lg border border-stone-300 bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Total Budget Target
                    </label>
                    <input
                      type="number"
                      step={500}
                      value={totalBudget}
                      onChange={(e) => setTotalBudget(Number(e.target.value))}
                      className="w-full px-3.5 py-2 text-xs rounded-lg border border-stone-300 bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Currency
                    </label>
                    <select
                      value={currency}
                      onChange={(e) => setCurrency(e.target.value)}
                      className="w-full px-3.5 py-2 text-xs rounded-lg border border-stone-300 bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                    >
                      <option value="USD">USD ($)</option>
                      <option value="EUR">EUR (€)</option>
                      <option value="GBP">GBP (£)</option>
                      <option value="INR">INR (₹)</option>
                      <option value="CAD">CAD ($)</option>
                      <option value="AUD">AUD ($)</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: AESTHETIC VIBE & SPECIAL REQUIREMENTS */}
          {step === 3 && (
            <div className="space-y-4">
              <div>
                <h4 className="text-base font-bold text-stone-900">
                  Stylistic Vibe & Personal Nuances
                </h4>
                <p className="text-xs text-stone-500 mt-0.5">
                  Describe the mood, lighting, color impulses, or special rituals.
                </p>
              </div>

              <div className="space-y-3.5">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Aesthetic Direction & Desired Ambiance
                  </label>
                  <textarea
                    rows={3}
                    value={styleVibe}
                    onChange={(e) => setStyleVibe(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs rounded-lg border border-stone-300 bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                    placeholder="e.g. Romantic Tuscan rustic luxury with amber candlelight, olive foliage, and acoustic sunset strings"
                  />
                  {/* Quick suggestion tags */}
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    <span className="text-[11px] text-stone-400 self-center">Quick inspirations:</span>
                    {[
                      'Warm champagne & amber candlelight',
                      'Minimalist Scandinavian editorial',
                      'Opulent midnight black & gold',
                      'Rustic botanical harvest garden',
                    ].map((snippet) => (
                      <button
                        key={snippet}
                        type="button"
                        onClick={() => setStyleVibe(snippet)}
                        className="text-[11px] px-2 py-0.5 rounded bg-stone-100 hover:bg-stone-200 text-stone-700 transition-colors"
                      >
                        {snippet}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Special Rituals, Dietary Needs, or Must-Haves
                  </label>
                  <textarea
                    rows={2}
                    value={specialRequirements}
                    onChange={(e) => setSpecialRequirements(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs rounded-lg border border-stone-300 bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                    placeholder="e.g. Gluten-free dessert bar, surprise video at 9 PM, sparkler exit, live jazz trio"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: GENERATING WITH GEMINI (PROGRESS SCREEN) */}
          {step === 4 && (
            <div className="py-12 px-4 text-center space-y-6">
              <div className="relative inline-flex items-center justify-center">
                <div className="w-16 h-16 rounded-full bg-amber-50 border-2 border-amber-500/40 flex items-center justify-center">
                  <Loader2 className="w-8 h-8 text-amber-600 animate-spin" />
                </div>
              </div>

              <div>
                <h4 className="text-lg font-bold text-stone-900" style={{ fontFamily: 'var(--font-heading)' }}>
                  Architecting Your Event Blueprint
                </h4>
                <p className="text-xs text-stone-500 mt-2 max-w-md mx-auto">
                  {loadingStepText}
                </p>
              </div>

              <div className="max-w-xs mx-auto space-y-2 text-left text-xs text-stone-500 bg-stone-50 p-4 rounded-xl border border-stone-100">
                <div className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Synthesizing creative concept & palette</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Computing itemized ${totalBudget} budget ledger</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Drafting run-of-show timeline schedule</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Curating vendor contracts & deliverables</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Controls */}
        {step !== 4 && (
          <div className="px-6 py-3.5 border-t border-stone-100 bg-stone-50/50 flex items-center justify-between">
            {step > 1 ? (
              <button
                type="button"
                onClick={() => setStep((step - 1) as any)}
                className="px-4 py-2 text-xs font-semibold text-stone-600 hover:text-stone-900 transition-colors"
              >
                Back
              </button>
            ) : (
              <div />
            )}

            {step < 3 ? (
              <button
                type="button"
                onClick={() => setStep((step + 1) as any)}
                className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-stone-900 hover:bg-stone-800 rounded-lg shadow-sm transition-all"
              >
                <span>Continue</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleGenerate}
                disabled={isLoading}
                className="flex items-center gap-1.5 px-5 py-2 text-xs font-semibold text-white bg-amber-600 hover:bg-amber-700 rounded-lg shadow-sm transition-all cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Generate Master Blueprint</span>
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
