import { CelebrationEvent } from '../types/event';

export const PRESET_EVENTS: CelebrationEvent[] = [
  {
    id: 'preset-wedding-vineyard',
    title: 'Golden Vineyard Wedding',
    type: 'wedding',
    date: '2026-11-14',
    location: 'Napa Valley Vineyards & Barrel Hall',
    guestCount: 120,
    totalBudget: 42000,
    currency: 'USD',
    heroImage: '/src/assets/images/event_wedding_hero_1792736919960.jpg',
    styleVibe: 'Romantic Tuscan rustic luxury with amber candlelight, olive foliage, and acoustic sunset strings',
    specialRequirements: 'Locally sourced biodynamic wine pairings, outdoor ceremony under olive trees, open-air dinner.',
    theme: {
      title: 'Solstice Tuscan Reverie',
      aesthetic: 'Understated Tuscan elegance with warm champagne metallics, rustic raw timber, and lush olive foliage',
      atmosphere: 'Intimate evening warmth with canopy string lights, beeswax pillar candles at varying heights, and soft dried herb aromatics',
      colorPalette: [
        { name: 'Champagne Gold', hex: '#D4AF37' },
        { name: 'Olive Leaf', hex: '#556B2F' },
        { name: 'Warm Alabaster', hex: '#FDFBF7' },
        { name: 'Deep Tuscan Slate', hex: '#2C3539' },
        { name: 'Dusty Rose', hex: '#C08081' }
      ],
      decorConcept: 'Exposed oak farm tables without heavy linens, botanical linen napkins tied with velvet ribbon, bronze candelabras, and handwritten seeded paper menus.',
      musicStyle: 'Acoustic fingerstyle guitar during ceremony, mellow French jazz quartet for dinner, soul & funk 7-piece band for dancing.',
      invitationWording: 'Together with their families, Maya and Ethan invite you to celebrate their union amidst the late autumn harvest vines of Napa Valley.'
    },
    budget: {
      categories: [
        {
          id: 'cat-venue-rentals',
          name: 'Venue & Property Hire',
          allocated: 12000,
          items: [
            { id: 'v-1', name: 'Vineyard Lawn & Barrel Room Exclusive Rental', estimatedCost: 9500, actualCost: 9500, paid: true, notes: 'Includes 12 hours load-in and cleanup buffer' },
            { id: 'v-2', name: 'Bespoke Wooden Farm Tables & Crossback Chairs', estimatedCost: 1800, actualCost: 1750, paid: true, notes: 'Delivery and styling included' },
            { id: 'v-3', name: 'Warm Bistro Festoon Canopy & Up-lighting', estimatedCost: 700, actualCost: 700, paid: false, notes: 'Ambient dimmable package' }
          ]
        },
        {
          id: 'cat-catering-bar',
          name: 'Artisan Catering & Estate Bar',
          allocated: 14500,
          items: [
            { id: 'c-1', name: 'Farm-to-Table 3-Course Plated Dinner', estimatedCost: 10800, actualCost: 11200, paid: true, notes: 'Seasonal harvest menu: duck confit & roasted squash ravioli' },
            { id: 'c-2', name: 'Local Estate Reserve Wine & Craft Cocktail Bar', estimatedCost: 3000, actualCost: 2900, paid: false, notes: 'Includes 2 signature cocktails' },
            { id: 'c-3', name: 'Artisan Olive Oil Cake with Fig Preserve', estimatedCost: 700, actualCost: 650, paid: true, notes: 'Three-tiered semi-naked finish' }
          ]
        },
        {
          id: 'cat-photo-video',
          name: 'Photography & Cinematography',
          allocated: 6200,
          items: [
            { id: 'pv-1', name: '10-Hour Fine Art Wedding Photographer', estimatedCost: 4200, actualCost: 4200, paid: true, notes: 'Includes second shooter and full digital gallery' },
            { id: 'pv-2', name: 'Cinematic Highlight Film (Super 8 & 4K)', estimatedCost: 2000, actualCost: 2000, paid: false, notes: 'Includes teaser reel within 7 days' }
          ]
        },
        {
          id: 'cat-florals-decor',
          name: 'Florals & Botanical Styling',
          allocated: 4800,
          items: [
            { id: 'f-1', name: 'Olive Branch Arbour & Meadow Ceremony Florals', estimatedCost: 2200, actualCost: 2100, paid: true, notes: 'Re-purposed to head table after ceremony' },
            { id: 'f-2', name: 'Farm Table Low Floral Bowls & Fruit Accents', estimatedCost: 1800, actualCost: 1800, paid: false, notes: 'Local garden roses, figs, and eucalyptus' },
            { id: 'f-3', name: 'Bridal Bouquet & Boutonnieres', estimatedCost: 800, actualCost: 850, paid: true, notes: 'Tied with raw silk ribbon' }
          ]
        },
        {
          id: 'cat-music-sound',
          name: 'Live Music & Audio Engineering',
          allocated: 3500,
          items: [
            { id: 'm-1', name: 'Ceremony Acoustic Duo & Sunset Cocktail Trio', estimatedCost: 1500, actualCost: 1500, paid: true, notes: 'Cello & acoustic guitar' },
            { id: 'm-2', name: 'Evening Soul & Brass 5-Piece Band', estimatedCost: 2000, actualCost: 2000, paid: false, notes: 'Includes wireless microphones and sound engineer' }
          ]
        },
        {
          id: 'cat-contingency',
          name: 'Contingency & Incidentals',
          allocated: 1000,
          items: [
            { id: 'cnt-1', name: 'Weather Backup Heaters & Tip Pool', estimatedCost: 1000, actualCost: 400, paid: false, notes: 'Retained for service staff appreciation' }
          ]
        }
      ]
    },
    timeline: {
      milestones: [
        { id: 'm-1', timeframe: '9 Months Out', title: 'Lock Venue & Master Date', description: 'Signed vineyard agreement and paid non-refundable deposit.', completed: true },
        { id: 'm-2', timeframe: '6 Months Out', title: 'Book Photographer & Tasting', description: 'Selected lead fine-art photographer; finalized farm dinner menu.', completed: true },
        { id: 'm-3', timeframe: '3 Months Out', title: 'Send Formal Invitations', description: 'Mailed custom calligraphed invitations with RSVP deadline 5 weeks out.', completed: true },
        { id: 'm-4', timeframe: '1 Month Out', title: 'Final Headcount & Seating Chart', description: 'Collect dietary restrictions and finalize table placement with wedding planner.', completed: true },
        { id: 'm-5', timeframe: '1 Week Out', title: 'Vendor Walkthrough & Sound Check', description: 'Onsite timing run-through with catering lead, coordinator, and audio crew.', completed: false },
        { id: 'm-6', timeframe: '1 Day Before', title: 'Rehearsal Dinner & Rest', description: 'Walk through ceremony cues and distribute tip envelopes to point coordinator.', completed: false }
      ],
      dayOfSchedule: [
        { id: 'sch-1', time: '11:00 AM', activity: 'Bridal Party Hair, Makeup & Mimosas', location: 'Estate Guest Villa', leadPerson: 'Lead Stylist Sarah', notes: 'Sandwiches and electrolyte waters ready' },
        { id: 'sch-2', time: '01:30 PM', activity: 'Florist & Rental Load-In', location: 'Ceremony Lawn & Dining Lawn', leadPerson: 'Floral Director Lucas', notes: 'Table arrangements setup before heat' },
        { id: 'sch-3', time: '03:00 PM', activity: 'First Look & Couple Portraits', location: 'Upper Hillside Olive Grove', leadPerson: 'Photographer Elena', notes: 'Private moment, no bridal party' },
        { id: 'sch-4', time: '04:30 PM', activity: 'Guest Arrival & Welcome Spritz', location: 'Courtyard Fountain Terrace', leadPerson: 'Catering Lead Marco', notes: 'Sparkling pear spritz and chilled citrus water' },
        { id: 'sch-5', time: '05:00 PM', activity: 'Ceremony Begins', location: 'Hillside Arbor Lawn', leadPerson: 'Officiant David', notes: 'Acoustic Canon in D on cello' },
        { id: 'sch-6', time: '05:45 PM', activity: 'Sunset Cocktail Hour & Passed Canapés', location: 'Barrel Hall Veranda', leadPerson: 'Acoustic Trio', notes: 'Golden hour portraits for couple 6:00-6:25 PM' },
        { id: 'sch-7', time: '07:00 PM', activity: 'Call to Dinner & Grand Entrance', location: 'Main Farmhouse Lawn', leadPerson: 'Band Leader', notes: 'Wine poured, welcome toasts begin 7:15 PM' },
        { id: 'sch-8', time: '08:45 PM', activity: 'Cake Cutting & First Dance', location: 'Under Festoon Canopy', leadPerson: 'Coordinator Clara', notes: 'Song: "La Vie En Rose"' },
        { id: 'sch-9', time: '11:00 PM', activity: 'Sparkler Send-Off & Late Shuttles', location: 'Estate Front Gates', leadPerson: 'Chauffeur Lead Dave', notes: 'Three shuttle vans running to downtown hotels' }
      ]
    },
    vendors: [
      {
        id: 'v-101',
        category: 'Venue',
        name: 'Meadowood Estate Vineyard',
        contact: 'events@meadowoodestate.mock / (707) 555-0192',
        quoteAmount: 9500,
        status: 'Booked',
        notes: 'Strict 11:30 PM outdoor music sound curfew',
        checklist: [
          'Verify certificate of event insurance',
          'Confirm ice machine access in catering kitchen',
          'Review guest parking logistics & shuttle turn radius'
        ]
      },
      {
        id: 'v-102',
        category: 'Catering',
        name: 'Heirloom Culinary Studio',
        contact: 'chef@heirloomharvest.mock / (415) 555-0144',
        quoteAmount: 11200,
        status: 'Booked',
        notes: '6 gluten-free and 4 vegan guest meals requested',
        checklist: [
          'Confirm headcount cutoff 10 business days prior',
          'Review vendor meal count (6 crew meals at 6:30 PM)',
          'Confirm bar glassware inventory count'
        ]
      },
      {
        id: 'v-103',
        category: 'Photography',
        name: 'Elena Vance Visuals',
        contact: 'elena@vancefineart.mock / (415) 555-0188',
        quoteAmount: 4200,
        status: 'Booked',
        notes: 'Natural light documentary style; shot list submitted',
        checklist: [
          'Provide family formal groupings list',
          'Confirm sunset portrait timing (6:05 PM)',
          'Arrange meal seat during reception'
        ]
      },
      {
        id: 'v-104',
        category: 'Florals',
        name: 'Wildflower & Twig Studio',
        contact: 'lucas@wildflowertwig.mock / (707) 555-0163',
        quoteAmount: 4800,
        status: 'Booked',
        notes: 'Compostable installations without floral foam',
        checklist: [
          'Confirm arbour repurpose plan for reception table',
          'Deliver bouquets in water vases by 1:00 PM',
          'Post-event breakdown at 11:30 PM'
        ]
      }
    ],
    personalizedTips: [
      'Napa late afternoon sun is bright; angle ceremony seating 20° north-east so guests are not squinting into direct sun.',
      'Repurposing the floral ceremony meadow to the head table saves approximately $1,200 in redundant floral arrangements.',
      'Ensure the wine service temperature is monitored in outdoor dining — chilling reds to 16°C prevents alcohol fumes in warm air.'
    ],
    createdAt: '2026-10-20T10:00:00Z'
  },
  {
    id: 'preset-birthday-rooftop',
    title: 'The Obsidian & Amber 40th',
    type: 'birthday',
    date: '2026-10-30',
    location: 'Skyline Terrace Lounge & Penthouse',
    guestCount: 65,
    totalBudget: 16000,
    currency: 'USD',
    heroImage: '/src/assets/images/event_birthday_hero_1792736920844.jpg',
    styleVibe: 'Sleek modern black-tie cocktail affair with glowing champagne towers, live deep lounge DJ, and passed luxury bites',
    specialRequirements: 'Surprise video montage at 9:00 PM, champagne tower pour at 8:00 PM, custom monogram ice block.',
    theme: {
      title: 'Obsidian Velvet & Champagne Amber',
      aesthetic: 'Moody metropolitan glam with high-gloss black marble, smoked glass, and warm amber candlelight',
      atmosphere: 'High-energy sophisticated cocktail lounge with deep house grooves, ambient twilight skyline views, and warm cocktail aromas',
      colorPalette: [
        { name: 'Obsidian Black', hex: '#111827' },
        { name: 'Warm Amber', hex: '#F59E0B' },
        { name: 'Brushed Brass', hex: '#CA8A04' },
        { name: 'Smoked Quartz', hex: '#4B5563' },
        { name: 'Crisp Cream', hex: '#FDFBF7' }
      ],
      decorConcept: 'Custom 5-tier coupe glass champagne tower, smoked acrylic bar signage, black tapered candle clusters in brass holders, and minimalist white calla lilies.',
      musicStyle: 'Deep melodic organic house seamlessly blending into classic 90s/2000s R&B remix sets.',
      invitationWording: 'Dress sharp. Drink vintage. Join us for a celebratory evening of fine spirits, skyline horizons, and four decades of greatness.'
    },
    budget: {
      categories: [
        {
          id: 'cat-b-venue',
          name: 'Penthouse Venue & Service',
          allocated: 5500,
          items: [
            { id: 'bv-1', name: 'Private Rooftop Terrace 6-Hour Buyout', estimatedCost: 4500, actualCost: 4500, paid: true, notes: 'Includes bar staff and security team' },
            { id: 'bv-2', name: 'Sound & Architectural Lighting Package', estimatedCost: 1000, actualCost: 1000, paid: true, notes: 'Warm amber terrace up-lighting' }
          ]
        },
        {
          id: 'cat-b-food-bar',
          name: 'Passed Canapés & Reserve Bar',
          allocated: 6200,
          items: [
            { id: 'bf-1', name: 'Luxury Hors d’Oeuvres (Truffle Sliders, Tuna Tartare)', estimatedCost: 3400, actualCost: 3500, paid: true, notes: 'Continuous circulation for 3 hours' },
            { id: 'bf-2', name: 'Prestige Champagne Tower Pour (Veuve Clicquot)', estimatedCost: 1600, actualCost: 1550, paid: true, notes: '4 cases allocated for opening pour' },
            { id: 'bf-3', name: 'Artisan Birthday Gateau (Valrhona Dark Chocolate)', estimatedCost: 600, actualCost: 600, paid: false, notes: 'Gold leaf geometric finish' },
            { id: 'bf-4', name: 'Late-Night Gourmet French Fry Bar', estimatedCost: 600, actualCost: 550, paid: false, notes: 'Served at 10:30 PM with artisan aiolis' }
          ]
        },
        {
          id: 'cat-b-ent-photo',
          name: 'Entertainment & Flash Studio',
          allocated: 3300,
          items: [
            { id: 'be-1', name: 'Live DJ & Saxophone Collaborator', estimatedCost: 2000, actualCost: 2000, paid: true, notes: '4-hour live improvised set' },
            { id: 'be-2', name: 'Editorial High-Contrast Flash Photo Booth', estimatedCost: 1300, actualCost: 1250, paid: true, notes: 'Kardashian-style monochrome prints + digital airdrop' }
          ]
        },
        {
          id: 'cat-b-misc',
          name: 'Signage & Styling Details',
          allocated: 1000,
          items: [
            { id: 'bm-1', name: 'Custom Monogram Ice Sculpture & Bar Decals', estimatedCost: 600, actualCost: 620, paid: true, notes: 'Double-carved "40" logo' },
            { id: 'bm-2', name: 'Velvet Guest Book & Custom Matches', estimatedCost: 400, actualCost: 380, paid: true, notes: 'Gold foil embossing' }
          ]
        }
      ]
    },
    timeline: {
      milestones: [
        { id: 'bm-m1', timeframe: '6 Weeks Out', title: 'Secure Penthouse & DJ', description: 'Confirmed buyout terms and DJ artist rider.', completed: true },
        { id: 'bm-m2', timeframe: '4 Weeks Out', title: 'Digital Video Invites Sent', description: 'Paperless Post video invitations with dress code briefing.', completed: true },
        { id: 'bm-m3', timeframe: '2 Weeks Out', title: 'Secret Video Montage Compilation', description: 'Gather 30-second birthday tributes from international friends.', completed: true },
        { id: 'bm-m4', timeframe: '3 Days Out', title: 'Confirm Coupes & Ice Delivery', description: 'Ensure glassware rack arrives at 4 PM for tower construction.', completed: false }
      ],
      dayOfSchedule: [
        { id: 'bs-1', time: '05:30 PM', activity: 'DJ Soundcheck & Lighting Calibration', location: 'Terrace Stage', leadPerson: 'DJ Zane', notes: 'Check bass resonance against venue limits' },
        { id: 'bs-2', time: '06:15 PM', activity: 'Champagne Tower Stack & Florals Set', location: 'Central Marble Table', leadPerson: 'Head Bartender Julian', notes: '5 levels, 55 coupes' },
        { id: 'bs-3', time: '07:30 PM', activity: 'Red Carpet Doors Open & Welcome Cocktails', location: 'Penthouse Foyer', leadPerson: 'Host Coordinator', notes: 'Smoked Old Fashioneds & French 75s' },
        { id: 'bs-4', time: '08:30 PM', activity: 'Champagne Tower Celebration Pour', location: 'Terrace Center', leadPerson: 'Birthday Honoree', notes: 'DJ drops crescendo track; sparklers ignited' },
        { id: 'bs-5', time: '09:15 PM', activity: 'Tributes, Toasts & Secret Video Screening', location: 'Lounge Projector Wall', leadPerson: 'Best Friend Dave', notes: '6-minute heartwarming video reel' },
        { id: 'bs-6', time: '10:00 PM', activity: 'Late Night Dance Set & Espresso Martinis', location: 'Terrace Dance Floor', leadPerson: 'DJ + Live Sax', notes: 'Tray-passed dessert bites' },
        { id: 'bs-7', time: '12:30 AM', activity: 'Celebration Wind Down & Rides', location: 'Lobby', leadPerson: 'Concierge', notes: 'Curated gift boxes handed to departing guests' }
      ]
    },
    vendors: [
      {
        id: 'bv-101',
        category: 'Venue & Bar',
        name: 'The Glasshouse Penthouse',
        contact: 'vip@theglasshouse.mock / (212) 555-0199',
        quoteAmount: 8000,
        status: 'Booked',
        notes: 'Includes exclusive elevator key access and coat check',
        checklist: [
          'Verify freight elevator schedule for ice delivery',
          'Coordinate audio decibel meter test',
          'Confirm guest list check-in tablet'
        ]
      },
      {
        id: 'bv-102',
        category: 'Music',
        name: 'DJ Zane & Saxophone Live',
        contact: 'booking@zanemusic.mock / (917) 555-0128',
        quoteAmount: 2000,
        status: 'Booked',
        notes: 'Provides wireless mic and monitoring speakers',
        checklist: [
          'Submit "Do Not Play" blacklist song list',
          'Coordinate 8:30 PM champagne pour musical cue',
          'Verify audio cabling to terrace speakers'
        ]
      }
    ],
    personalizedTips: [
      'For a 5-tier champagne tower, always glue the coupe bases with dry ice mist or food-grade sugar syrup if on an outdoor windy rooftop.',
      'Schedule speeches immediately following the champagne pour while everyone has a fresh drink in hand and attention is centered.',
      'Passed mini truffle sliders and late-night fries at 10:30 PM keep guest energy soaring until the 1 AM curfew.'
    ],
    createdAt: '2026-10-21T14:00:00Z'
  },
  {
    id: 'preset-community-harvest',
    title: 'Riverside Autumn Harvest Gala',
    type: 'community',
    date: '2026-11-21',
    location: 'Historic Riverwalk Square & Public Pavilion',
    guestCount: 350,
    totalBudget: 28000,
    currency: 'USD',
    heroImage: '/src/assets/images/event_community_hero_1792736920840.jpg',
    styleVibe: 'Warm communal autumn festival with artisan food vendors, local acoustic stages, harvest florals, and lantern walk',
    specialRequirements: 'Municipal permit clearances, bilingual signage, accessible ramps, and zero-waste composting stations.',
    theme: {
      title: 'Heritage Harvest & River Lanterns',
      aesthetic: 'Wholesome historic village market with timber pergolas, woven baskets, pumpkin arches, and warm hanging lanterns',
      atmosphere: 'Bustling, welcoming community spirit with the aroma of roasted chestnuts, warm spiced apple cider, and lively acoustic fiddle tunes',
      colorPalette: [
        { name: 'Harvest Terracotta', hex: '#C25E34' },
        { name: 'Warm Amber Honey', hex: '#D97706' },
        { name: 'Sage Green', hex: '#65A30D' },
        { name: 'Stone Grey', hex: '#4B5563' },
        { name: 'Natural Burlap', hex: '#F3ECE4' }
      ],
      decorConcept: 'Cedar planter boxes overflowing with sunflowers and decorative cabbages, hay bale seating circles around acoustic corners, and biodegradable paper lanterns for the evening riverwalk.',
      musicStyle: 'Folk ensembles, bluegrass string trios, and high school brass band showcase.',
      invitationWording: 'Join our neighborhood celebration of seasonal bounty, local craftsmanship, and community fellowship along the Historic Riverwalk.'
    },
    budget: {
      categories: [
        {
          id: 'cat-c-permits-site',
          name: 'City Permits, Power & Facilities',
          allocated: 6500,
          items: [
            { id: 'cp-1', name: 'Municipal Park Permit & Street Closure Authorization', estimatedCost: 2200, actualCost: 2200, paid: true, notes: 'Approved by city council' },
            { id: 'cp-2', name: 'Commercial Silent Power Generators & Cable Ramps', estimatedCost: 1800, actualCost: 1750, paid: true, notes: 'Powers stage and vendor stalls' },
            { id: 'cp-3', name: 'Luxury Portable Restroom Trailers & ADA Units', estimatedCost: 1500, actualCost: 1500, paid: true, notes: 'Includes hourly servicing' },
            { id: 'cp-4', name: 'Zero-Waste Stations & Recycling Crew', estimatedCost: 1000, actualCost: 950, paid: false, notes: 'Targeting 85% diversion from landfill' }
          ]
        },
        {
          id: 'cat-c-stalls-staging',
          name: 'Artisan Stalls & Main Stage',
          allocated: 7800,
          items: [
            { id: 'cs-1', name: '18 Cedar Artisan Market Pop-Up Stalls', estimatedCost: 3800, actualCost: 3800, paid: true, notes: 'Subsidized partially by vendor entry fees' },
            { id: 'cs-2', name: 'Covered Wooden Bandstand Stage & Sound System', estimatedCost: 2500, actualCost: 2400, paid: true, notes: 'Audio technician on duty all day' },
            { id: 'cs-3', name: 'Hay Bale Seating & Picnic Benches', estimatedCost: 1500, actualCost: 1400, paid: true, notes: 'Fire-retardant treated bales' }
          ]
        },
        {
          id: 'cat-c-food-communal',
          name: 'Community Cider, Pies & Tasting',
          allocated: 6200,
          items: [
            { id: 'cf-1', name: 'Community Apple Press & Warm Spiced Cider Vat', estimatedCost: 1600, actualCost: 1600, paid: true, notes: 'Free for all attendees' },
            { id: 'cf-2', name: 'Local Bakery Harvest Pie Competition (50 Pies)', estimatedCost: 1200, actualCost: 1100, paid: true, notes: 'Prizes for winners' },
            { id: 'cf-3', name: 'Food Truck Coordination & Food Safety Permits', estimatedCost: 1400, actualCost: 1400, paid: true, notes: '4 artisan trucks on commission' },
            { id: 'cf-4', name: 'Riverwalk Twilight Paper Lanterns (400 Units)', estimatedCost: 2000, actualCost: 1950, paid: false, notes: 'Solar-powered LED candles inside' }
          ]
        },
        {
          id: 'cat-c-marketing-safety',
          name: 'Signage, Safety & Volunteers',
          allocated: 4500,
          items: [
            { id: 'cm-1', name: 'Wayfinding Banners, Map Signs & Bilingual Program', estimatedCost: 1800, actualCost: 1700, paid: true, notes: 'Eco-friendly cardboard print' },
            { id: 'cm-2', name: 'First Aid EMT Station & Off-Duty Police Detail', estimatedCost: 1700, actualCost: 1700, paid: false, notes: 'City-mandated safety requirement' },
            { id: 'cm-3', name: 'Volunteer T-Shirts & Meal Vouchers (30 Volunteers)', estimatedCost: 1000, actualCost: 950, paid: true, notes: 'Bright gold identifiable crew shirts' }
          ]
        },
        {
          id: 'cat-c-reserve',
          name: 'Emergency Reserve',
          allocated: 3000,
          items: [
            { id: 'cr-1', name: 'Inclement Weather Tenting Contingency', estimatedCost: 3000, actualCost: 0, paid: false, notes: 'Held until 48 hours prior' }
          ]
        }
      ]
    },
    timeline: {
      milestones: [
        { id: 'cm-1', timeframe: '4 Months Out', title: 'Submit Municipal Park & Street Permits', description: 'Filed event permit application with Parks & Rec.', completed: true },
        { id: 'cm-2', timeframe: '2 Months Out', title: 'Artisan & Food Vendor Callout', description: 'Selected 18 craftspeople and 4 food trucks.', completed: true },
        { id: 'cm-3', timeframe: '1 Month Out', title: 'Volunteer Orientation & EMT Booking', description: 'Mobilized 30 neighborhood volunteers for logistics shifts.', completed: true },
        { id: 'cm-4', timeframe: '1 Week Out', title: 'Final Safety & Electrical Inspection', description: 'Fire marshal and city inspector walkthrough.', completed: false }
      ],
      dayOfSchedule: [
        { id: 'cs-1', time: '07:00 AM', activity: 'Street Closure & Generator Deployment', location: 'Riverwalk North & South Gates', leadPerson: 'Logistics Lead Dan', notes: 'Place barricades and cable protectors' },
        { id: 'cs-2', time: '08:30 AM', activity: 'Artisan Vendor Check-In & Stall Setup', location: 'Central Promenade', leadPerson: 'Vendor Captain Maria', notes: 'Ensure each stall has authorized power access' },
        { id: 'cs-3', time: '10:30 AM', activity: 'Festival Gates Open & Cider Press Starts', location: 'Riverwalk Plaza', leadPerson: 'Mayor & Committee', notes: 'Opening speech and ceremonial ribbon untying' },
        { id: 'cs-4', time: '11:00 AM', activity: 'Live Bluegrass String Trio Performance', location: 'Bandstand Stage', leadPerson: 'Sound Tech', notes: 'Family dancing and lawn games' },
        { id: 'cs-5', time: '02:00 PM', activity: 'Annual Harvest Pie Baking Judging', location: 'Pavilion Hall', leadPerson: 'Guest Chef Judges', notes: 'Announce 1st, 2nd, and Community Choice winners' },
        { id: 'cs-6', time: '05:00 PM', activity: 'Lighting of Riverwalk Lanterns & Twilight Parade', location: 'Riverwalk Boardwalk', leadPerson: 'Youth Parade Coordinators', notes: 'Distribute 400 LED paper lanterns to families' },
        { id: 'cs-7', time: '08:00 PM', activity: 'Festival Close & Volunteer Strike Down', location: 'Entire Promenade', leadPerson: 'All Captains', notes: 'Pack artisan stalls, clear waste stations, reopen street by 10 PM' }
      ]
    },
    vendors: [
      {
        id: 'cv-1',
        category: 'Power & Production',
        name: 'Metro Audio & Power Rentals',
        contact: 'dispatch@metropower.mock / (555) 019-3321',
        quoteAmount: 4300,
        status: 'Booked',
        notes: 'Includes 2 silent WhisperWatt generators and distro boxes',
        checklist: [
          'Verify grounding rods placement on soft soil',
          'Coordinate fuel top-off at 2:00 PM',
          'Test emergency cut-off switches'
        ]
      },
      {
        id: 'cv-2',
        category: 'Restrooms & Sanitation',
        name: 'GreenSanitation Logistics',
        contact: 'service@greensanitation.mock / (555) 014-9912',
        quoteAmount: 2500,
        status: 'Booked',
        notes: 'Handwashing stations must be kept full of potable water',
        checklist: [
          'Verify ADA accessibility ramp slope',
          'Service check every 2 hours during peak festival times',
          'Prompt 8:30 PM pump-out and removal'
        ]
      }
    ],
    personalizedTips: [
      'For community events with over 300 guests, install double-sided signage at all intersections so crowds flow naturally without choking points.',
      'Providing free warm cider at the entrance sets an overwhelmingly positive tone and encourages families to explore the artisan booths.',
      'Appoint a dedicated "Volunteer Relief Captain" with bottled water and sunscreen to cycle crew members every 90 minutes.'
    ],
    createdAt: '2026-10-22T08:00:00Z'
  }
];
