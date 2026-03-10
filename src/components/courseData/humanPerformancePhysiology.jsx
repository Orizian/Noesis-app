// humanPerformancePhysiology.js
// Human Performance Physiology — Noesis Course Data
// Version: 2.0 — Full audit applied, all fields complete

export const COURSE_META = {
  id: 'exercise-science',
  title: 'Human Performance Physiology',
  description: 'A rigorous mechanistic course in the physiology of human performance. Students develop genuine causal understanding of how muscle, metabolic, neural, hormonal, cardiovascular, and connective tissue systems interact to produce, limit, and adapt to physical training. Every root requires scenario-based mechanistic reasoning — not recall — and builds toward an integrated model of how the body responds to athletic demand.',
  tag: 'Exercise Science',
  difficulty: 3,
  depth: 3,
  scope: 2,
  duration: 'long',
  learningMode: 'Mastery-Based',
  rootSummaries: [
    {
      id: 1,
      title: 'Muscle Fiber Architecture and Force Production',
      summary: 'Explains why identical muscle volume produces different power outputs through fiber type composition, contractile speed, and fatigue resistance. Students learn to predict how fiber type shapes both peak power and fatigability across exercise contexts.'
    },
    {
      id: 2,
      title: 'Energy Systems and Their Interaction',
      summary: 'Covers the phosphocreatine, glycolytic, and aerobic systems as a simultaneous continuum rather than sequential switches. Students explain power output curves, identify specific metabolic transitions, and predict the consequences of substrate manipulation.'
    },
    {
      id: 3,
      title: 'Neuromuscular Activation and Motor Unit Recruitment',
      summary: 'Explores how the nervous system controls force output through recruitment and rate coding, and how post-activation potentiation, CNS fatigue, and voluntary activation explain strength differences independent of muscle size.'
    },
    {
      id: 4,
      title: 'Acute Hormonal Response to Training',
      summary: 'Examines why identical training volumes produce different hormonal profiles, and why a larger acute hormonal response does not automatically produce greater hypertrophy. Students learn to reason about chronic hormonal environment, not just acute peaks.'
    },
    {
      id: 5,
      title: 'Muscle Protein Synthesis and the Hypertrophy Signal',
      summary: 'Covers the leucine threshold, mTORC1 activation, and net protein balance across the full 24-hour cycle. Students predict how protein distribution, training status, and signaling pathway interactions determine hypertrophy outcomes.'
    },
    {
      id: 6,
      title: 'Cardiovascular Adaptation to Endurance Training',
      summary: 'Explains eccentric cardiac hypertrophy, the Fick equation, and why resting heart rate decrease is a derived consequence of stroke volume increase rather than an independent adaptation. Students predict detraining sequences and calculate performance ceilings.'
    },
    {
      id: 7,
      title: 'Connective Tissue Adaptation',
      summary: 'Examines why tendon and ligament adaptation lags behind muscular and cardiovascular adaptation, the cellular mechanism of collagen synthesis, and how load management prevents injury during rapid training load increases.'
    },
    {
      id: 8,
      title: 'Training Principles: Overload, Specificity, and Recovery',
      summary: 'Integrates overload, specificity, and recovery into a coherent framework for understanding why varied training outperforms narrow specificity at certain training stages, and why reducing volume can produce performance improvements.'
    }
  ]
};

export const ROOTS = [
  {
    id: 1,
    title: 'Muscle Fiber Architecture and Force Production',
    domain: 'Muscle Physiology',
    cognitiveLevel: 'Predictive Reasoning',
    branchCriteriaCounts: [3, 3, 3],
    rootQuestion: `A sprinter and a marathon runner have identical total quadriceps muscle volume confirmed by MRI. During a maximal sprint the sprinter produces 340 watts of peak power. The marathon runner produces 180 watts peak power from the same muscle volume. Neither athlete is injured. Explain the specific structural difference in muscle fiber composition that accounts for this power differential, explain why fiber type produces this difference mechanistically rather than just correlating with it, and predict what would happen to each athlete's power output and fatigue rate if both performed a 45-minute moderate intensity cycling session immediately before the sprint test.`,
    branches: [
      {
        label: 'Edge Case',
        question: `A previously sedentary person begins a 16-week resistance training program. Muscle biopsies taken before and after show no significant change in the ratio of Type I to Type II fibers. Yet their peak power output has increased by 35 percent. Explain the specific structural and neural adaptations that produced this power increase without fiber type conversion, and predict which of these adaptations reached its ceiling first.`
      },
      {
        label: 'Cross-Root Integration',
        question: `The sprinter from the root question also has a significantly higher testosterone response to resistance training than the marathon runner. Using your understanding of both muscle fiber architecture and hormonal response to exercise, predict how the hormonal difference interacts with the existing fiber type composition to affect hypertrophy potential in each athlete, and explain why the same hormonal signal produces different structural outcomes in fiber-type-different muscles.`
      },
      {
        label: 'Counterintuitive Prediction',
        question: `A muscle biopsy of an elite powerlifter shows that 60 percent of their vastus lateralis fibers are Type I slow-twitch despite their sport demanding maximal force production. Explain why this finding is less surprising than it initially appears, identify the specific training characteristic of powerlifting that selects for this fiber composition over time, and predict how this powerlifter's performance would compare to a sprinter on a test of maximal force production versus rate of force development.`
      }
    ],
    rubric: `Criterion 1: Identifies Type I versus Type II fiber distinction as the structural mechanism accounting for the power differential — not training history, motivation, or total muscle volume. Criterion 2: Connects fiber type to contractile speed and fatigue resistance mechanistically — explains why the structural difference produces the power difference, not just that it correlates with it. Criterion 3: Predicts the pre-fatigue effect on the sprinter specifically using fiber type logic — Type II depletion reducing peak power output disproportionately. Criterion 4: Predicts the pre-fatigue effect on the marathon runner specifically using fiber type logic — Type I dominance conferring relatively greater resistance to power loss from the same aerobic protocol.`
  },
  {
    id: 2,
    title: 'Energy Systems and Their Interaction',
    domain: 'Exercise Metabolism',
    cognitiveLevel: 'Mechanistic Explanation',
    branchCriteriaCounts: [3, 3, 3],
    rootQuestion: `A cyclist is performing a 20-minute time trial at maximum sustainable effort. At the 30-second mark their power output is 420 watts. At the 5-minute mark it has dropped to 310 watts. At the 15-minute mark it has stabilized at 285 watts. They are not pacing — they are going as hard as possible at each moment. Explain the specific energy system transitions that account for this power output curve, identify the metabolic event that causes the drop from 420 to 310 watts specifically, and predict what the power output curve would look like if the same athlete performed the same test after 3 days of carbohydrate restriction to deplete muscle glycogen.`,
    branches: [
      {
        label: 'Edge Case',
        question: `Two athletes have identical VO2 max values of 65 ml/kg/min. In a 10km race one athlete runs 32 minutes and the other runs 38 minutes. Using energy system principles explain what specific metabolic variable best explains this performance difference despite identical maximal aerobic capacity, and predict how each athlete's lactate curve would look during an incremental exercise test.`
      },
      {
        label: 'Cross-Root Integration',
        question: `The phosphocreatine system and the glycolytic system both contribute to a 400-meter sprint. Using your understanding of energy systems and muscle fiber architecture predict how the relative contribution of each system changes across the 400 meters, explain why the dramatic slowdown in the final 100 meters of most 400-meter races is a metabolic event not a motivational one, and identify the specific metabolic accumulation that drives this slowdown.`
      },
      {
        label: 'Counterintuitive Prediction',
        question: `An endurance athlete performs 8 weeks of sprint interval training — 6 second maximal sprints with 4 minute recovery — with no changes to their steady-state aerobic training. Their 10km race time improves by 90 seconds despite the interval training never stressing their aerobic system significantly. Explain the specific adaptations from sprint interval training that improve endurance performance through a non-aerobic mechanism.`
      }
    ],
    rubric: `Criterion 1: Correctly identifies the energy system transitions across the time trial — PCr system dominant in the first approximately 10 seconds, glycolytic system dominant from roughly 10 seconds through the 5-minute mark, aerobic system reaching steady-state contribution by 15 minutes. Criterion 2: Identifies PCr depletion specifically as the metabolic event causing the initial power drop from 420 toward the glycolytic-dominant phase — not glycogen depletion, not lactate, not general fatigue. Criterion 3: Predicts the glycogen depletion effect on aerobic contribution correctly — reduced glycolytic substrate forces greater reliance on fat oxidation, which regenerates ATP more slowly and lowers the sustainable power ceiling. Criterion 4: Predicts the glycogen depletion effect on the early anaerobic phase correctly — glycolytic capacity is severely impaired from the start, eliminating the high-power opening phase and flattening the power curve.`
  },
  {
    id: 3,
    title: 'Neuromuscular Activation and Motor Unit Recruitment',
    domain: 'Neuromuscular Physiology',
    cognitiveLevel: 'Mechanistic Explanation',
    branchCriteriaCounts: [3, 3, 3],
    rootQuestion: `A powerlifter attempts a maximal deadlift of 250kg — a weight they have lifted before. On the first attempt they fail at the sticking point. On the second attempt 4 minutes later they successfully complete the lift. Their muscle strength has not changed between attempts. Explain the specific neuromuscular mechanism that allowed the second attempt to succeed where the first failed, identify what changed in the nervous system between attempts rather than in the muscle, and predict what would happen to their maximal lift capacity if they performed 30 minutes of light cardio immediately before the third attempt.`,
    branches: [
      {
        label: 'Edge Case',
        question: `A stroke patient has lost the ability to voluntarily activate the left bicep despite the muscle being completely intact — no atrophy, normal histology, normal response to direct electrical stimulation. Yet when the patient yawns, the left bicep contracts involuntarily. Explain the specific neurological distinction between voluntary and involuntary motor activation that accounts for this pattern, and predict what rehabilitation approach would most efficiently restore voluntary control.`
      },
      {
        label: 'Cross-Root Integration',
        question: `Elite weightlifters produce higher peak forces than equally strong powerlifters during ballistic movements despite having similar one-rep max scores. Using your understanding of both motor unit recruitment and muscle fiber architecture explain the specific neuromuscular characteristic that accounts for this difference in rate of force development, and predict how training each quality specifically changes the recruitment pattern over time.`
      },
      {
        label: 'Counterintuitive Prediction',
        question: `A researcher measures motor unit recruitment during a set of bicep curls taken to failure with a light weight — 30 percent of one rep max. Early in the set only low-threshold motor units are active. By the final repetitions before failure, high-threshold motor units are fully recruited despite the load being only 30 percent of maximum. Explain the specific mechanism that forces high-threshold motor unit recruitment at low loads when taken to failure, and predict the hypertrophy stimulus of this protocol compared to a heavy set at 85 percent of one rep max stopped well short of failure.`
      }
    ],
    rubric: `Criterion 1: Explains that the first failed attempt temporarily enhanced contractile readiness for the second attempt — specifically that a prior near-maximal contraction phosphorylated myosin regulatory light chains, increasing calcium sensitivity of the contractile apparatus and allowing greater force production at the same level of neural input. Criterion 2: Identifies that what changed between attempts was neural rather than muscular — specifically rate coding, motor unit synchronization, or elevated motor unit excitability — not an increase in muscle strength or fiber recruitment capacity. Criterion 3: Predicts the time-dependency of this effect correctly — the enhancement is temporary and requires an appropriate rest window of 3 to 5 minutes to express; too little rest and fatigue from the first attempt masks the potentiation, too much rest and the phosphorylation state dissipates. Criterion 4: Predicts the light cardio effect using CNS fatigue as the mechanism — low-intensity cardio can accumulate inhibitory neural signals that reduce maximal motor unit recruitment without peripherally fatiguing the muscles themselves.`
  },
  {
    id: 4,
    title: 'Acute Hormonal Response to Training',
    domain: 'Endocrinology',
    cognitiveLevel: 'Predictive Reasoning',
    branchCriteriaCounts: [3, 3, 3],
    rootQuestion: `Two athletes perform resistance training sessions of identical volume — same exercises, sets, reps, and total tonnage. Athlete A performs the session as straight sets with 3 minutes rest between sets over 60 minutes. Athlete B performs the same volume as supersets with 60 seconds rest between exercises over 35 minutes. Blood samples taken immediately after each session show dramatically different hormonal profiles — Athlete B has significantly higher testosterone, growth hormone, and cortisol. Both athletes have trained for 5 years. Explain the specific training variable that drives the hormonal difference, predict whether the higher hormonal response in Athlete B produces greater muscle protein synthesis over the following 48 hours, and explain why the answer to that prediction is less straightforward than it initially appears.`,
    branches: [
      {
        label: 'Edge Case',
        question: `A 45-year-old male athlete has resting testosterone levels 40 percent below the normal range for his age despite excellent health, nutrition, and sleep. His resistance training produces a normal acute hormonal response — testosterone rises appropriately during and after training. Yet his hypertrophy response to training over 12 weeks is significantly blunted compared to age-matched peers with normal testosterone. Explain the specific mechanism by which chronically low resting testosterone blunts hypertrophy despite a normal acute response, and identify at what point in the muscle protein synthesis cascade the deficit manifests.`
      },
      {
        label: 'Cross-Root Integration',
        question: `Cortisol rises acutely during both resistance training and endurance training. Using your understanding of hormonal response and energy systems explain why acute cortisol elevation during training serves a different metabolic function in resistance versus endurance contexts, predict the consequence of chronically elevated resting cortisol on muscle protein balance, and explain why the timing of cortisol elevation relative to anabolic hormones determines whether the net effect is catabolic or anabolic.`
      },
      {
        label: 'Counterintuitive Prediction',
        question: `Two athletes have identical training programs and nutrition. Athlete A sleeps 8 hours per night consistently. Athlete B sleeps 5.5 hours per night. After 12 weeks Athlete B has gained significantly less muscle despite identical training stimulus and caloric intake. A muscle biopsy shows identical rates of muscle protein synthesis in both athletes measured immediately after training sessions. Explain where in the 24-hour recovery cycle the hormonal difference between athletes is producing the divergent outcomes, and predict the specific hormonal measurement that would most clearly explain the difference.`
      }
    ],
    rubric: `Criterion 1: Identifies metabolic stress — byproduct accumulation from higher training density — as the specific training variable driving Athlete B's higher hormonal response despite identical volume. Criterion 2: Addresses the distinction between acute hormonal spike and chronic anabolic environment — correctly identifies that a larger acute response does not automatically produce greater muscle protein synthesis over 48 hours. Criterion 3: Identifies receptor sensitivity and chronic hormonal environment as the variables that determine whether an acute spike translates into downstream hypertrophy. Criterion 4: Explains why the prediction is less straightforward — the relationship between acute hormonal peaks and downstream hypertrophy is nonlinear and depends on the chronic hormonal baseline, not peak concentration alone.`
  },
  {
    id: 5,
    title: 'Muscle Protein Synthesis and the Hypertrophy Signal',
    domain: 'Molecular Physiology',
    cognitiveLevel: 'Mechanistic Explanation',
    branchCriteriaCounts: [3, 3, 3],
    rootQuestion: `A researcher gives two groups of subjects identical resistance training programs for 16 weeks. Group A consumes 1.6 grams of protein per kilogram of bodyweight daily evenly distributed across 4 meals. Group B consumes the same total daily protein in 2 meals — a small breakfast and a large dinner. Both groups gain strength equally. Group A gains significantly more muscle mass. Explain the specific molecular mechanism by which protein distribution affects muscle protein synthesis independent of total protein intake, identify the signaling pathway that is differentially activated, and predict the minimum meal protein dose required to maximally stimulate this pathway in a trained individual versus an untrained individual.`,
    branches: [
      {
        label: 'Edge Case',
        question: `A bodybuilder tears their left bicep completely at the musculotendinous junction and undergoes surgical repair. During the 12-week immobilization period they continue training the right arm intensively. At 12 weeks the right arm has gained 2cm of circumference. Surprisingly the left arm, while atrophied, has lost less muscle than predicted by immobilization research. Explain the specific mechanism by which intensive unilateral training attenuates contralateral muscle atrophy, identify the neural and systemic pathways responsible, and predict whether this cross-education effect is sufficient to meaningfully affect rehabilitation outcomes.`
      },
      {
        label: 'Cross-Root Integration',
        question: `mTORC1 is the primary anabolic signaling hub for muscle protein synthesis. Both resistance exercise and leucine from dietary protein activate mTORC1. Using your understanding of muscle protein synthesis and hormonal response to training explain why combining resistance exercise and protein intake produces greater mTORC1 activation than either stimulus alone, predict the optimal timing window between training and protein intake for maximal synergistic activation, and explain why this timing effect diminishes in highly trained individuals compared to beginners.`
      },
      {
        label: 'Counterintuitive Prediction',
        question: `A study compares two hypertrophy programs over 6 months. Program A uses traditional progressive overload — adding weight each week. Program B keeps weight constant but increases reps until a set becomes easy then adds a small weight increment. Both programs equate total volume. At 6 months muscle biopsies show identical hypertrophy. However subjects in Program B report significantly lower perceived exertion and better recovery. Explain why identical hypertrophy outcomes are possible through mechanically different loading approaches, identify what the actual driver of the hypertrophic stimulus is in both programs, and predict which program would produce greater strength gains despite identical hypertrophy.`
      }
    ],
    rubric: `Criterion 1: Identifies leucine threshold as the specific molecular mechanism — each meal must contain sufficient leucine to cross the activation threshold for mTORC1. Criterion 2: Identifies mTORC1 as the specific signaling pathway that is differentially activated by distributed versus concentrated protein intake. Criterion 3: Connects protein distribution to pulsatile mTORC1 activation — more meals crossing the leucine threshold means more discrete synthesis pulses versus one or two large pulses followed by prolonged sub-threshold periods. Criterion 4: Addresses the trained versus untrained leucine threshold difference — trained individuals require a higher leucine dose per meal to maximally stimulate mTORC1, making distribution even more critical as training age increases.`
  },
  {
    id: 6,
    title: 'Cardiovascular Adaptation to Endurance Training',
    domain: 'Cardiovascular Physiology',
    cognitiveLevel: 'System Integration',
    branchCriteriaCounts: [3, 3, 3],
    rootQuestion: `An untrained 25-year-old begins an 8-month endurance training program. At baseline their resting heart rate is 72 bpm, stroke volume is 70ml, and VO2 max is 38 ml/kg/min. After 8 months their resting heart rate is 48 bpm, stroke volume is 105ml, and VO2 max is 52 ml/kg/min. Their maximum heart rate has not changed. Explain the specific structural cardiac adaptation that accounts for the stroke volume increase, explain why resting heart rate decreases as a mathematical consequence of stroke volume increase rather than as an independent adaptation, and predict what happens to each of these three variables during the first 3 weeks of complete detraining.`,
    branches: [
      {
        label: 'Edge Case',
        question: `A competitive cyclist with a VO2 max of 72 ml/kg/min and resting heart rate of 38 bpm develops a cardiac arrhythmia requiring a pacemaker set at a fixed rate of 70 bpm. Their maximum achievable heart rate is now 70 bpm. Predict their new VO2 max and explain the specific cardiovascular equation that determines this value, identify which component of the Fick equation is most limiting in this scenario, and predict how this athlete's performance across different event durations — sprint versus middle distance versus ultra-endurance — changes relative to their pre-pacemaker capacity.`
      },
      {
        label: 'Cross-Root Integration',
        question: `Endurance training and resistance training produce opposing cardiac adaptations — eccentric versus concentric hypertrophy. Using your understanding of cardiovascular adaptation and the energy systems explain why the mechanical demand of each training modality produces structurally opposite cardiac responses, predict the cardiac morphology of an athlete who trains both modalities equally at high volume, and explain why the combined cardiac phenotype is actually advantageous rather than a compromise.`
      },
      {
        label: 'Counterintuitive Prediction',
        question: `A 50-year-old sedentary individual begins endurance training and after one year achieves a VO2 max of 45 ml/kg/min — above average for their age. An elite 20-year-old endurance athlete has a VO2 max of 78 ml/kg/min. The older trained individual's cardiac output at maximal exercise is actually higher relative to their VO2 max than the elite athlete's. Explain the specific cardiovascular variable that accounts for this — why the older trained individual needs more cardiac output per unit of oxygen consumed than the elite athlete — and predict what peripheral adaptation in the elite athlete explains their superior oxygen extraction efficiency.`
      }
    ],
    rubric: `Criterion 1: Identifies eccentric cardiac hypertrophy — increased end-diastolic volume — as the specific structural cardiac adaptation accounting for the stroke volume increase. Criterion 2: Derives resting heart rate decrease mathematically from stroke volume increase using the cardiac output equation — resting cardiac output is relatively fixed so heart rate must fall as stroke volume rises — identifying this as consequence not independent adaptation. Criterion 3: Predicts the detraining sequence for stroke volume correctly — reverses relatively quickly within 1 to 2 weeks as plasma volume decreases. Criterion 4: Predicts the detraining sequence for VO2 max correctly — declines more slowly than stroke volume because peripheral adaptations such as mitochondrial and capillary density persist longer than central cardiac changes.`
  },
  {
    id: 7,
    title: 'Connective Tissue Adaptation',
    domain: 'Connective Tissue Biology',
    cognitiveLevel: 'Predictive Reasoning',
    branchCriteriaCounts: [3, 3, 3],
    rootQuestion: `A 28-year-old recreational runner increases their weekly mileage from 30km to 60km over 6 weeks in preparation for a marathon. At week 5 they develop Achilles tendinopathy — pain and morning stiffness at the Achilles tendon insertion. Their cardiovascular fitness has improved normally throughout this period. The tendon has not ruptured. Explain the specific structural reason why connective tissue adaptation lags behind cardiovascular and muscular adaptation during rapid training load increases, identify the cellular mechanism responsible for tendon remodeling and why it is rate-limited, and predict what training modification would allow this athlete to reach 60km per week without developing tendinopathy given a longer timeline.`,
    branches: [
      {
        label: 'Edge Case',
        question: `Two athletes sustain identical grade 2 medial collateral ligament sprains of the knee. Athlete A has been resistance training for 6 years. Athlete B has been sedentary. MRI confirms equivalent ligament damage in both. At 12 weeks Athlete A has returned to full sport while Athlete B is still in rehabilitation. Both athletes had identical rehabilitation programs. Explain the specific pre-injury structural differences in Athlete A's ligament that account for the faster recovery, identify the cellular mechanism that produced these structural differences through training, and predict whether the recovered ligament in Athlete A returns to its pre-injury structural quality.`
      },
      {
        label: 'Cross-Root Integration',
        question: `Heavy resistance training produces both muscular hypertrophy and increased tendon stiffness. Using your understanding of connective tissue adaptation and neuromuscular activation explain why increased tendon stiffness is actually advantageous for force production rather than simply being a parallel adaptation, identify the specific mechanical property of stiff tendons that enhances rate of force development, and predict the performance consequence for an athlete who has high muscular strength but undertrained tendon stiffness.`
      },
      {
        label: 'Counterintuitive Prediction',
        question: `A researcher compares tendon collagen synthesis rates in athletes performing heavy resistance training versus moderate intensity endurance training matched for total lower limb mechanical loading. The endurance training group shows higher rates of tendon collagen synthesis despite lower peak forces. Explain the specific loading characteristic — not peak force — that most strongly drives tendon collagen synthesis, identify what property of cyclical loading at moderate force is a stronger collagen synthesis stimulus than infrequent loading at high force, and predict the optimal tendon conditioning protocol for an athlete returning from tendon injury.`
      }
    ],
    rubric: `Criterion 1: Identifies tenocyte remodeling rate as the rate-limiting factor — tenocytes synthesize and remodel collagen more slowly than muscle cells hypertrophy or cardiovascular adaptations occur. Criterion 2: Explains the limited vascularity of tendon as the mechanistic basis for slower adaptation — lower blood supply means slower delivery of nutrients and signaling molecules to tenocytes, constraining their synthesis capacity. Criterion 3: Predicts the correct training modification using load management principles — a longer ramp-up timeline with smaller weekly mileage increments rather than rest or complete load avoidance. Criterion 4: Connects the load management prediction to the tenocyte mechanism — slower load increase gives tenocytes sufficient time to synthesize new collagen and remodel the matrix between loading sessions, keeping cumulative demand within structural tolerance.`
  },
  {
    id: 8,
    title: 'Training Principles: Overload, Specificity, and Recovery',
    domain: 'Training Systems',
    cognitiveLevel: 'System Integration',
    branchCriteriaCounts: [3, 3, 3],
    rootQuestion: `Two athletes both want to improve their 400-meter sprint time. Athlete A runs 400-meter repeats at race pace 4 times per week. Athlete B runs a variety of distances — 100m, 200m, 400m, and 800m repeats — at varied intensities 5 times per week with one session per week of heavy resistance training. After 16 weeks Athlete A has improved their 400m time by 1.8 seconds. Athlete B has improved by 3.1 seconds. Both athletes recovered well with no injuries. Explain the specific training principle that accounts for Athlete B's superior improvement despite less specific training, predict which athlete has a higher ceiling for further improvement at the 400-meter distance, and explain why the optimal specificity ratio changes as an athlete approaches their genetic potential.`,
    branches: [
      {
        label: 'Edge Case',
        question: `A highly trained athlete takes a planned 4-week complete rest period — no training whatsoever. At the end of 4 weeks their VO2 max has dropped by 8 percent, their strength has dropped by 4 percent, and their body composition has changed minimally. They resume training and within 3 weeks are back to all baseline measures. Explain the specific mechanisms that allow such rapid restoration of fitness, identify what structural adaptations are genuinely lost versus simply suppressed during 4 weeks of detraining, and predict how the detraining and retraining response would differ for an athlete who takes a 6-month break rather than 4 weeks.`
      },
      {
        label: 'Cross-Root Integration',
        question: `Progressive overload requires continually increasing training stress to drive adaptation. Using your understanding of both training principles and hormonal response explain why linear progressive overload — adding weight every session — works well for beginners but produces diminishing returns and increasing injury risk for advanced athletes, identify the specific hormonal and structural reason the adaptation curve flattens, and predict the optimal periodization structure for an advanced athlete that maintains progressive overload without requiring linear load increases every session.`
      },
      {
        label: 'Counterintuitive Prediction',
        question: `A strength athlete reduces their training volume by 40 percent for 3 weeks while maintaining training intensity — same weights, fewer sets. At the end of the taper their performance on a maximal strength test improves by 6 percent compared to their pre-taper baseline. Explain the specific physiological mechanism by which reducing training volume while maintaining intensity produces a performance increase rather than a decrease, identify what was accumulating during the high-volume training phase that was masking true strength capacity, and predict the optimal taper duration and volume reduction percentage for maximizing this effect.`
      }
    ],
    rubric: `Criterion 1: Identifies varied stimulus — different distances and intensities stressing different energy systems and neuromuscular qualities — as the mechanism behind Athlete B's superior improvement, not more training time or volume. Criterion 2: Addresses the specificity-variability tradeoff explicitly — explains why less task-specific training produced better results at this stage of training development by building broader adaptation base. Criterion 3: Predicts which athlete has a higher ceiling correctly — Athlete B, because their broader adaptation base leaves more room for specific refinement, while Athlete A has already been highly specific and faces diminishing returns in the systems that matter for 400m. Criterion 4: Explains why the optimal specificity ratio changes as an athlete approaches genetic potential — early-stage athletes adapt to almost any stimulus; advanced athletes have saturated most common adaptation pathways and require broader, more varied stimuli to find remaining headroom.`
  }
];

export const DICTIONARY = {
  1: [
    {
      term: 'Type I Fiber',
      definition: 'A slow-twitch muscle fiber that produces moderate force but resists fatigue. Powered primarily by aerobic metabolism.',
      why: 'The marathon runner\'s quadriceps are dominated by these, which is why they can sustain effort for hours but cannot match the sprinter\'s peak power from the same muscle volume.',
      excellent_standard: 'An Excellent answer identifies Type I fibers as slow-twitch, aerobically powered, and fatigue-resistant, explains the causal chain: high mitochondrial density enables sustained oxidative ATP production, which allows prolonged moderate force output without the byproduct accumulation that causes fatigue. It then predicts the consequence if these fibers are absent or impaired — loss of endurance capacity, shift toward glycolytic energy dependence, earlier fatigue onset during any sustained activity even at moderate intensity.'
    },
    {
      term: 'Type II Fiber',
      definition: 'A fast-twitch muscle fiber that produces high force rapidly but fatigues quickly. Powered primarily by glycolytic metabolism.',
      why: 'The sprinter\'s power advantage comes almost entirely from a higher proportion of these fibers in the same muscle volume — they produce force faster but at the cost of rapid fatigue.',
      excellent_standard: 'An Excellent answer identifies Type II fibers as fast-twitch, glycolytically powered, high-force but fatigue-prone, and explains why: rapid myosin ATPase activity enables fast cross-bridge cycling and high peak force, but the glycolytic ATP production that sustains this produces hydrogen ions and inorganic phosphate that accumulate and inhibit contractile function. If Type II fibers are absent, peak power drops significantly even though the muscle volume and endurance capacity may be preserved.'
    },
    {
      term: 'Motor Unit',
      definition: 'A single motor neuron and all the muscle fibers it controls. The basic functional unit of muscle activation.',
      why: 'The nervous system recruits motor units in order of size, which determines how force output scales with effort level.',
      excellent_standard: 'An Excellent answer defines a motor unit as one motor neuron plus all its innervated muscle fibers, explains that Henneman\'s size principle governs recruitment from smallest to largest as force demand increases, and addresses the consequence of motor unit loss: peak force production becomes incomplete and ungraded, with high-threshold units being most impactful when lost because they access the largest, fastest-twitch fibers.'
    },
    {
      term: 'Myofibril',
      definition: 'The contractile structure inside a muscle fiber containing the actin and myosin filaments that generate force.',
      why: 'More myofibrils per fiber means more force-generating cross-bridge sites, increasing force capacity independent of fiber type.',
      excellent_standard: 'An Excellent answer identifies myofibrils as the actin-myosin-containing contractile structures within each fiber, explains that myofibrillar density directly increases force capacity because each myofibril contributes additional cross-bridge cycling sites, and predicts that if myofibrillar density decreases through atrophy or disuse, force output falls proportionally even with intact motor unit recruitment and normal fiber type composition.'
    },
    {
      term: 'Sarcomere',
      definition: 'The smallest contractile unit of a myofibril. Shortens during contraction by actin and myosin filaments sliding past each other.',
      why: 'Sarcomere mechanics are the molecular foundation for all muscle force production — understanding them is prerequisite to understanding fiber type differences.',
      excellent_standard: 'An Excellent answer defines the sarcomere as the repeating actin-myosin unit within a myofibril, explains the sliding filament mechanism as the causal basis of force production — myosin heads bind actin, hydrolyze ATP, and pull the filaments inward, shortening the sarcomere — and addresses what happens if sarcomere function is impaired: cross-bridge cycling fails and force cannot be transmitted through the contractile chain regardless of motor unit recruitment.'
    },
    {
      term: 'Fatigue Resistance',
      definition: 'The ability of a muscle fiber to maintain force output over repeated contractions without significant force decline.',
      why: 'It is the core functional difference between Type I and Type II fibers and is the direct mechanistic cause of the sprinter-to-marathon runner power differential.',
      excellent_standard: 'An Excellent answer defines fatigue resistance as sustained force output capacity across repeated contractions, explains the causal mechanism: aerobic ATP production in Type I fibers avoids the byproduct accumulation — hydrogen ions, inorganic phosphate — that impairs contractile protein function, and predicts the consequence when fatigue resistance is reduced: force drops progressively during sustained effort and performance degrades rapidly in any endurance context even at moderate intensity.'
    },
    {
      term: 'Oxidative Capacity',
      definition: 'The ability of a muscle fiber to produce ATP using oxygen via mitochondrial metabolism. Higher in Type I fibers.',
      why: 'Determines how long a fiber can sustain activity at a given force level before metabolic byproduct accumulation forces power reduction.',
      excellent_standard: 'An Excellent answer defines oxidative capacity as mitochondria-dependent aerobic ATP production, explains the causal chain: higher mitochondrial density enables more sustained ATP regeneration without byproduct accumulation, directly producing greater fatigue resistance. If oxidative capacity is impaired through mitochondrial dysfunction or reduced oxygen delivery, sustainable power drops, the athlete becomes reliant on glycolytic pathways that fatigue faster, and performance in any effort lasting more than a few minutes is severely compromised.'
    },
    {
      term: 'Glycolytic Capacity',
      definition: 'The ability of a muscle fiber to produce ATP rapidly from stored glucose without oxygen. Higher in Type II fibers.',
      why: 'Enables the explosive peak power of sprinting but produces fatigue-causing byproducts rapidly, explaining the sprinter\'s fatigue rate disadvantage in sustained effort.',
      excellent_standard: 'An Excellent answer defines glycolytic capacity as rapid anaerobic ATP production from glucose, explains that this enables explosive high-force output because ATP is generated faster than aerobic pathways allow, but accumulation of hydrogen ions and inorganic phosphate impairs myosin ATPase and calcium release, causing rapid fatigue. If glycolytic capacity is absent, peak explosive power is severely reduced even though endurance capacity may be relatively preserved.'
    },
    {
      term: 'Fiber Type Composition',
      definition: 'The ratio of Type I to Type II fibers in a given muscle. Largely genetically determined and relatively resistant to conversion by training.',
      why: 'It is the structural explanation for why two athletes with identical muscle volume produce different peak power outputs in the root question.',
      excellent_standard: 'An Excellent answer defines fiber type composition as the Type I to Type II ratio and identifies it as the primary structural determinant of power versus endurance capacity, explains that each fiber type has fundamentally different contractile speed and metabolic properties that determine both peak force and fatigue rate, and predicts the consequence of altered composition: a muscle shifted toward Type II produces more peak power but fatigues faster; shifted toward Type I it sustains output longer but cannot match the peak force of a Type II dominant muscle at equal volume.'
    },
    {
      term: 'Pennation Angle',
      definition: 'The angle at which muscle fibers attach to the tendon. Higher pennation angles allow more fibers to be packed into the same muscle volume.',
      why: 'Affects force production capacity independent of fiber type, demonstrating that muscle architecture beyond fiber composition contributes to the volume-to-power relationship.',
      excellent_standard: 'An Excellent answer defines pennation angle as the fiber-to-tendon attachment angle, explains the causal mechanism: higher pennation increases physiological cross-sectional area by packing more fibers into the same muscle volume, increasing total force capacity, but reduces the fiber shortening distance contribution to joint movement. The consequence if pennation is suboptimal: force production or contraction velocity is compromised even with identical muscle volume and fiber type, explaining why muscle volume alone is insufficient to predict power output.'
    }
  ],
  2: [
    {
      term: 'ATP',
      definition: 'Adenosine triphosphate. The universal energy currency of the cell. Every muscular contraction requires continuous ATP availability.',
      why: 'All three energy systems exist solely to regenerate ATP at different rates and durations — understanding this unifies the entire energy system framework.',
      excellent_standard: 'An Excellent answer defines ATP as the immediate energy currency for muscle contraction, explains the causal chain: ATP hydrolysis by myosin ATPase releases the energy that drives cross-bridge cycling, and without continuous regeneration contraction stops regardless of fuel substrate availability. If ATP regeneration fails across all three systems simultaneously — as in severe metabolic illness — force production fails immediately and completely, not gradually, because the contractile machinery requires ATP at every step.'
    },
    {
      term: 'Phosphocreatine System',
      definition: 'Regenerates ATP almost instantaneously from stored creatine phosphate. Dominant in the first approximately 10 seconds of maximal effort.',
      why: 'Powers the explosive opening phase of the time trial and is the specific system whose depletion triggers the initial power drop in the root question.',
      excellent_standard: 'An Excellent answer defines the PCr system as near-instant ATP regeneration from creatine phosphate via a single enzymatic step, explains that its speed advantage comes from bypassing multi-step metabolic pathways and requiring no oxygen or complex substrate handling, and addresses the consequence of PCr depletion: power output drops rapidly until the glycolytic system ramps up, creating the characteristic power fall in the first minute of maximal effort. Without PCr resynthesis capacity, explosive short-duration performance is severely impaired.'
    },
    {
      term: 'Glycolytic System',
      definition: 'Regenerates ATP rapidly from stored muscle glycogen without oxygen. Primary contributor from approximately 10 seconds to 2 minutes of maximal effort.',
      why: 'The primary system in the middle phase of the time trial and the source of the byproducts that drive the power drop from 420 to 310 watts.',
      excellent_standard: 'An Excellent answer defines glycolysis as rapid anaerobic ATP regeneration from glycogen, explains that it bridges the gap between PCr depletion and full aerobic contribution but produces hydrogen ions that accumulate and inhibit contractile proteins, causing the progressive power drop between the 30-second and 5-minute marks in the root question. If glycolytic capacity is impaired through glycogen depletion, the high-power anaerobic phase is eliminated and performance is immediately limited to aerobic capacity from the start.'
    },
    {
      term: 'Aerobic System',
      definition: 'Regenerates ATP using oxygen and multiple fuel substrates. Slow to reach full capacity but highly sustainable over extended effort.',
      why: 'The system responsible for the stabilized power output at 15 minutes — the point where aerobic contribution reaches steady state.',
      excellent_standard: 'An Excellent answer defines the aerobic system as oxygen-dependent ATP regeneration from carbohydrate and fat via mitochondrial oxidative phosphorylation, explains that its delayed ramp-up reflects the time required for oxygen delivery, mitochondrial enzyme activation, and substrate mobilization to reach steady state, and addresses the consequence of impaired aerobic contribution: sustainable power output collapses to glycolytic limits only, making any effort lasting beyond 2 minutes unsustainable at moderate to high intensity.'
    },
    {
      term: 'VO2 Max',
      definition: 'Maximum rate of oxygen consumption during exercise. Represents the ceiling of aerobic energy production.',
      why: 'Determines the upper limit of sustainable aerobic power output, but does not by itself explain performance differences between athletes with identical values.',
      excellent_standard: 'An Excellent answer defines VO2 max as the maximum oxygen uptake rate and aerobic energy production ceiling, explains that it is determined by both cardiac output and peripheral oxygen extraction, and addresses the critical limitation: identical VO2 max values in two athletes do not predict identical performance because the sustainable fraction of VO2 max — determined by lactate threshold — is the more predictive variable for race performance. Treating VO2 max as the sole performance predictor cannot explain the performance gap in Branch 1.'
    },
    {
      term: 'Lactate Threshold',
      definition: 'The exercise intensity at which lactate begins accumulating in the blood faster than it can be cleared.',
      why: 'The metabolic variable that best explains the 6-minute performance gap between athletes with identical VO2 max values in Branch 1.',
      excellent_standard: 'An Excellent answer defines lactate threshold as the intensity where production exceeds clearance, explains the causal chain: below threshold lactate is cleared continuously and effort is sustainable indefinitely at that intensity; above threshold accumulation increases progressively, causing acidosis and fatigue. It addresses the consequence of a low lactate threshold: the athlete must work at a lower fraction of VO2 max to stay below threshold, directly limiting sustainable race pace regardless of maximal aerobic capacity — explaining the performance gap in Branch 1 without any difference in VO2 max.'
    },
    {
      term: 'Glycogen',
      definition: 'The stored form of carbohydrate in muscle and liver. Primary fuel substrate for the glycolytic system and a key substrate for the aerobic system at moderate-to-high intensities.',
      why: 'Its depletion through carbohydrate restriction in the root question directly impairs both the glycolytic and aerobic systems\' contribution to power output.',
      excellent_standard: 'An Excellent answer defines glycogen as stored muscle and liver carbohydrate and identifies it as the primary substrate for both glycolytic and aerobic ATP production at moderate-to-high intensity, and addresses the depletion consequences: with muscle glycogen absent, glycolytic contribution is eliminated, removing the high-power anaerobic phase; the aerobic system shifts to fat oxidation which regenerates ATP more slowly, lowering the sustainable power ceiling. The opening explosive phase of the power curve is eliminated and the stable plateau falls significantly.'
    },
    {
      term: 'Hydrogen Ions',
      definition: 'Byproduct of glycolytic ATP production. Accumulate during high-intensity exercise and impair muscle contractility by lowering intracellular pH.',
      why: 'Their accumulation — not lactate itself — is the specific mechanism driving the power drop as glycolysis reaches its limits in the time trial.',
      excellent_standard: 'An Excellent answer defines hydrogen ions as glycolytic byproducts that accumulate during high-intensity effort, explains the causal mechanism: rising hydrogen ion concentration lowers intracellular pH, inhibiting myosin ATPase activity and impairing calcium release from the sarcoplasmic reticulum, directly reducing contractile force. If this accumulation mechanism is absent, the natural power regulation during intense effort is disrupted — athletes would experience more severe structural consequences without the protective downregulation that H+ accumulation enforces.'
    },
    {
      term: 'Energy System Continuum',
      definition: 'The principle that all three energy systems contribute simultaneously to ATP production at all times, with relative contributions shifting based on exercise intensity and duration.',
      why: 'The root question power curve only makes sense through this lens — no system switches off while another switches on.',
      excellent_standard: 'An Excellent answer defines the continuum as simultaneous multi-system ATP contribution with shifting dominance rather than sequential activation, explains the causal logic: all three systems run concurrently with relative percentages changing continuously as intensity and duration change. If this principle is misunderstood and systems are treated as sequential, predicting metabolic events becomes impossible — specifically the gradual power curve decline in the root question cannot be explained because there is no single moment where one system stops and another starts.'
    },
    {
      term: 'Metabolic Fatigue',
      definition: 'Force reduction caused by metabolic byproduct accumulation rather than structural muscle damage or motivational deficit.',
      why: 'Explains why the 400-meter slowdown in Branch 2 is a metabolic event — the accumulation of H+ and inorganic phosphate forces power reduction involuntarily.',
      excellent_standard: 'An Excellent answer defines metabolic fatigue as byproduct-driven force reduction distinct from structural damage or motivation, explains the causal chain: hydrogen ions, inorganic phosphate, and other metabolites directly inhibit contractile protein function and calcium handling, reducing force output independently of the athlete\'s intention. The consequence of misattributing this to motivation: incorrect interventions — psychological coaching instead of metabolic load management — and persistent misunderstanding of why performance decline at the end of a sprint is involuntary and physiologically determined.'
    }
  ],
  3: [
    {
      term: 'Motor Unit Recruitment',
      definition: 'The process of activating motor units to produce force. More units recruited means more total force produced.',
      why: 'What changed between the first and second deadlift attempt was recruitment quality — not muscle strength — making this the central variable of the root question.',
      excellent_standard: 'An Excellent answer defines recruitment as the activation of motor units to scale force output, explains the causal chain: the nervous system activates additional units as force demand increases, with higher-threshold units accessing more powerful fast-twitch fibers. If recruitment is impaired — as in neural fatigue or CNS inhibition — peak force drops even though the muscle is structurally capable, explaining why the same muscle can produce different peak forces on consecutive attempts without any change in muscle properties.'
    },
    {
      term: 'Rate Coding',
      definition: 'Increasing the firing frequency of already-recruited motor units to increase force output beyond what additional recruitment alone can provide.',
      why: 'Alongside recruitment, it is a key mechanism of post-activation potentiation and explains neural strength gains that occur without muscle growth.',
      excellent_standard: 'An Excellent answer defines rate coding as firing frequency modulation of already-recruited motor units, explains that higher firing frequency produces summation of twitches — individual contractions fuse into sustained higher-force output — and addresses the consequence of impaired rate coding: even with full motor unit recruitment, peak force is limited if units cannot fire rapidly enough to achieve tetanic contraction. This is why neural training improves strength without muscle growth — the same fibers are activated more effectively through both recruitment and rate coding improvements.'
    },
    {
      term: 'Post-Activation Potentiation',
      definition: 'Temporary enhancement of force production following a prior maximal or near-maximal contraction.',
      why: 'The specific neuromuscular mechanism that allowed the second deadlift attempt to succeed where the first failed — the prior attempt potentiated the contractile apparatus.',
      excellent_standard: 'An Excellent answer defines PAP as temporary force enhancement following near-maximal effort, explains the causal mechanism: prior maximal contraction phosphorylates myosin regulatory light chains, increasing the calcium sensitivity of the contractile apparatus and allowing greater force production at the same level of neural input. If PAP is absent, the second attempt offers no neuromuscular advantage over the first, and performance on repeated maximal efforts within a short window would not improve without additional training stimulus.'
    },
    {
      term: 'Neuromuscular Junction',
      definition: 'The synapse between a motor neuron and a muscle fiber. The site where the neural signal is converted into a muscle action potential that triggers contraction.',
      why: 'The point in the signaling chain where neural drive is translated into mechanical force — impairment here explains intact nerve function with absent voluntary muscle response.',
      excellent_standard: 'An Excellent answer defines the NMJ as the motor neuron to muscle fiber synapse, explains the causal chain: the action potential triggers acetylcholine release, which binds receptors on the muscle membrane, initiating the electrical event that releases calcium from the sarcoplasmic reticulum and activates the contractile apparatus. If NMJ transmission fails — through disease, toxin, or fatigue — the neural drive exists but force is not produced, creating the pattern of intact nerve function with absent muscle response seen in certain neuromuscular disorders.'
    },
    {
      term: 'Central Nervous System Fatigue',
      definition: 'Reduction in the nervous system\'s ability to drive maximal motor unit recruitment and rate coding, independent of peripheral muscle fatigue.',
      why: 'Light cardio before a maximal lift impairs CNS output capacity without peripherally fatiguing the muscles, explaining the predicted reduction in third-attempt performance.',
      excellent_standard: 'An Excellent answer defines CNS fatigue as reduced neural drive to motor units independent of muscle fatigue, explains the causal chain: accumulation of inhibitory signals in the motor cortex and spinal cord reduces the maximum recruitment and rate coding the nervous system can sustain, lowering peak force output even when muscles are fully rested. The consequence: an athlete can experience significantly reduced maximal strength from activities that produce no peripheral muscle fatigue — purely from reduced CNS output capacity — which is why light cardio can impair a subsequent maximal strength test.'
    },
    {
      term: 'Synchronization',
      definition: 'The coordination of multiple motor units firing at similar times to concentrate force production within a brief window.',
      why: 'Higher motor unit synchronization in trained athletes contributes to their ability to express near-maximal force during explosive efforts.',
      excellent_standard: 'An Excellent answer defines synchronization as coordinated timing of motor unit firing, explains that synchronized firing produces concentrated force peaks that summate more effectively during ballistic efforts than asynchronous firing, and addresses the consequence of poor synchronization: force is produced less efficiently — individual motor unit contributions are spread across time rather than concentrated — reducing peak force expression relative to total recruited muscle mass. This is why maximal strength training improves performance beyond what muscle growth explains.'
    },
    {
      term: 'Voluntary Activation',
      definition: 'The percentage of a muscle\'s total force capacity that the nervous system can voluntarily access under maximal effort conditions.',
      why: 'Explains why psychological readiness and neural factors affect maximal strength expression independent of muscle size — untrained individuals rarely access 100% of their force capacity.',
      excellent_standard: 'An Excellent answer defines voluntary activation as the fraction of total force capacity accessible through maximal voluntary effort, explains that it is limited by inhibitory CNS mechanisms designed to protect musculoskeletal structures from damage, and addresses the consequence: even a well-trained muscle produces less than its maximum structural force capacity unless voluntary activation is high. Strength training raises voluntary activation, explaining disproportionate strength gains relative to muscle growth particularly in trained athletes who have already developed substantial muscle mass.'
    },
    {
      term: 'Henneman\'s Size Principle',
      definition: 'Motor units are recruited from smallest to largest as force demand or fatigue increases.',
      why: 'The foundational principle explaining why light loads taken to failure eventually recruit high-threshold motor units — fatigue drives escalating recruitment.',
      excellent_standard: 'An Excellent answer defines the size principle as smallest-to-largest motor unit recruitment order, explains the causal logic: small motor units have lower activation thresholds and fatigue slowly; as they fatigue during sustained effort their force output drops and the nervous system compensates by recruiting progressively larger, higher-threshold units. The consequence if this principle is misunderstood: the mechanism by which light loads produce meaningful hypertrophy when taken to failure becomes unexplainable, since the high-threshold fiber recruitment that drives the stimulus cannot be accounted for.'
    },
    {
      term: 'Rate of Force Development',
      definition: 'How quickly a muscle can reach peak force output. Measured as the slope of the force-time curve. Distinct from peak force itself.',
      why: 'The key variable distinguishing weightlifter and powerlifter performance in Branch 2 — similar peak force, dramatically different speed of force expression.',
      excellent_standard: 'An Excellent answer defines RFD as the slope of the force-time curve — how rapidly peak force is reached — explains that it is determined by motor unit recruitment speed, rate coding, and fiber type composition, and addresses the consequence of low RFD: in ballistic movements where contact or propulsion time is brief, peak force is never reached regardless of maximal strength because the movement ends before full force expression is possible. High maximal strength without high RFD produces limited explosive athletic performance.'
    },
    {
      term: 'Ballistic Movement',
      definition: 'A movement executed with the intent to apply maximum force as rapidly as possible.',
      why: 'The context where rate coding differences between weightlifters and powerlifters become measurable and practically significant for performance.',
      excellent_standard: 'An Excellent answer defines ballistic movement as maximum-intent rapid force application, explains that performance in these movements depends on RFD rather than peak force because movement duration is shorter than the time required to reach peak force, and addresses the consequence: athletes with high maximal strength but low RFD are significantly disadvantaged in any sport requiring explosive movements — their strength advantage cannot be expressed in the available time window. This is why sport-specific power training targets RFD, not just maximal strength.'
    }
  ],
  4: [
    {
      term: 'Testosterone',
      definition: 'Primary anabolic sex hormone. Drives muscle protein synthesis, satellite cell activation, and androgen receptor upregulation.',
      why: 'The hormonal difference between training protocols in the root question and the central variable whose chronic deficiency blunts hypertrophy in Branch 1.',
      excellent_standard: 'An Excellent answer defines testosterone as the primary androgen driving muscle protein synthesis and satellite cell activation, explains the causal chain: testosterone binds androgen receptors which upregulate gene expression for contractile protein production and activate satellite cells for myonuclear addition. It addresses what changes when chronically low: not just the acute training response, but the baseline anabolic environment between sessions is persistently compromised, blunting hypertrophy even when training stimulus and acute hormonal response are normal — because the inter-session environment determines net protein balance.'
    },
    {
      term: 'Cortisol',
      definition: 'Primary stress hormone. Acutely necessary for training-driven substrate mobilization but chronically elevated levels create a catabolic hormonal environment.',
      why: 'Its dual role in Branch 2 explains why the same hormone serves different metabolic functions in resistance versus endurance training contexts.',
      excellent_standard: 'An Excellent answer defines cortisol as the primary stress hormone with distinct acute and chronic effects, explains the causal distinction: acute cortisol during training mobilizes substrates, drives adaptation signaling, and is necessary and beneficial; chronically elevated resting cortisol continuously activates protein catabolism pathways, breaking down muscle between sessions and creating persistent negative net protein balance. If cortisol is chronically elevated — from overtraining, sleep deprivation, or psychological stress — muscle loss occurs even with adequate training and nutrition.'
    },
    {
      term: 'Growth Hormone',
      definition: 'Anabolic hormone released in pulses during deep sleep and exercise. Stimulates IGF-1 production and fat mobilization.',
      why: 'The specific hormone whose nocturnal secretion pattern explains the sleep deprivation hypertrophy deficit in Branch 3.',
      excellent_standard: 'An Excellent answer defines GH as an anabolic hormone released in pulses during deep sleep and exercise, explains the causal chain: GH stimulates IGF-1 production in the liver and locally in muscle, which activates mTORC1 and downstream protein synthesis pathways. The primary consequence of sleep deprivation: the largest GH pulse — which occurs during the first deep sleep cycle — is lost or blunted, reducing total overnight GH exposure and downstream IGF-1 signaling, impairing muscle protein synthesis during the recovery window even when training and nutrition are identical between athletes.'
    },
    {
      term: 'Anabolic',
      definition: 'Promoting tissue building and net muscle protein synthesis.',
      why: 'Athlete B\'s post-session hormonal environment is more acutely anabolic due to metabolic stress — but this does not automatically produce more hypertrophy over 48 hours.',
      excellent_standard: 'An Excellent answer defines anabolic as tissue-building and protein synthesis promoting, explains the mechanism: anabolic hormones bind receptors that activate gene transcription for structural proteins, driving net positive protein balance. It then addresses the critical nuance: a more acutely anabolic hormonal spike does not automatically produce more hypertrophy — receptor sensitivity, chronic hormonal environment, and the duration of elevated signaling determine actual downstream synthesis rates. A brief large spike in a low-receptor-sensitivity tissue produces less hypertrophy than a moderate sustained signal in a highly sensitive tissue.'
    },
    {
      term: 'Catabolic',
      definition: 'Promoting tissue breakdown and net muscle protein degradation.',
      why: 'Chronic cortisol elevation shifts the entire hormonal environment toward net catabolism even when acute training responses are normal.',
      excellent_standard: 'An Excellent answer defines catabolic as tissue-breakdown promoting, explains that catabolism is part of the normal remodeling cycle — not inherently harmful — but becomes problematic when chronically exceeding anabolism, creating net protein loss. It addresses the consequence of chronic catabolism: even with adequate protein intake and normal training response, chronically elevated catabolic signaling creates persistent negative net protein balance, leading to muscle loss over time. This explains why psychological stress, poor sleep, and overtraining can independently cause muscle loss.'
    },
    {
      term: 'Hormonal Milieu',
      definition: 'The combined hormonal environment at a given time — the net effect of all circulating hormones on cellular signaling rather than any single hormone in isolation.',
      why: 'The root question asks about this rather than any single hormone, because cellular outcomes depend on the interaction of the entire hormonal environment.',
      excellent_standard: 'An Excellent answer defines hormonal milieu as the combined circulating hormone environment, explains the causal importance: cellular outcomes depend on the ratio and interaction of all hormones simultaneously — high testosterone in a high-cortisol environment produces different outcomes than in a low-cortisol environment because receptor competition and downstream signaling interact. The consequence of evaluating single hormones in isolation: predictions about muscle gain, recovery, and adaptation become unreliable because the net effect depends on the entire hormonal context, not individual peaks.'
    },
    {
      term: 'Metabolic Stress',
      definition: 'The accumulation of metabolic byproducts — hydrogen ions, lactate, inorganic phosphate — during high-density exercise.',
      why: 'The specific training variable driving Athlete B\'s higher hormonal response despite identical volume to Athlete A.',
      excellent_standard: 'An Excellent answer defines metabolic stress as byproduct accumulation from high training density, explains the causal chain: hydrogen ions, lactate, and metabolites act as hormonal signals — particularly for GH and testosterone release — through reduced oxygen tension and metabolite-sensitive receptor activation. The consequence of low metabolic stress despite high volume: the acute hormonal stimulus is blunted because the signal is absent even if total tonnage is identical. This explains why training density rather than volume alone drives acute hormonal response.'
    },
    {
      term: 'Acute Hormonal Response',
      definition: 'The short-term elevation in anabolic and catabolic hormones immediately following an exercise session.',
      why: 'The root question reveals that a larger acute response does not necessarily produce greater hypertrophy — the chronic hormonal environment and receptor sensitivity matter more than peak concentration.',
      excellent_standard: 'An Excellent answer defines the acute hormonal response as the immediate post-exercise hormone elevation, explains the important causal limitation: acute spikes create a brief anabolic signal but downstream protein synthesis depends on receptor availability, baseline hormonal environment, and duration of elevated signaling — not peak concentration alone. The key consequence: athletes who optimize training for acute hormonal spikes may produce larger peaks without proportionally greater hypertrophy if chronic environment or receptor sensitivity is the actual limiting factor.'
    },
    {
      term: 'Androgen Receptor',
      definition: 'Intracellular receptor that binds testosterone and mediates its anabolic effects on gene transcription and protein synthesis.',
      why: 'Receptor density and sensitivity rather than hormone concentration alone explains why chronically low baseline testosterone blunts hypertrophy in Branch 1.',
      excellent_standard: 'An Excellent answer defines androgen receptors as the intracellular mediators of testosterone\'s anabolic effect, explains the causal chain: receptor binding activates gene transcription for protein synthesis and satellite cell activation — without adequate receptor availability or sensitivity, testosterone cannot produce its downstream effects regardless of concentration. The consequence of low receptor density: even normal testosterone levels produce blunted hypertrophy; conversely, training-induced receptor upregulation can improve hypertrophy outcomes independently of hormone levels.'
    },
    {
      term: 'IGF-1',
      definition: 'Insulin-like growth factor 1. The primary downstream mediator of growth hormone\'s anabolic effects on muscle tissue.',
      why: 'The specific hormonal measurement that would most clearly explain the sleep deprivation hypertrophy deficit in Branch 3, linking GH secretion to downstream synthesis.',
      excellent_standard: 'An Excellent answer defines IGF-1 as the downstream GH mediator that directly activates muscle protein synthesis pathways, explains the causal chain: GH stimulates hepatic and local muscle IGF-1 production, which activates the PI3K-Akt-mTORC1 pathway and directly drives ribosomal protein synthesis. The consequence of reduced IGF-1: even with intact training stimulus and protein intake, the anabolic signaling cascade is attenuated at the mTORC1 activation step, reducing synthesis rates during the recovery window — making IGF-1 the single most informative measurement for explaining sleep-deprivation-induced hypertrophy blunting.'
    }
  ],
  5: [
    {
      term: 'Muscle Protein Synthesis',
      definition: 'The process of incorporating amino acids into new muscle proteins. The anabolic side of net protein balance.',
      why: 'The rate of MPS relative to muscle protein breakdown determines whether net muscle gain occurs — the entire root question is about what determines MPS rate across the day.',
      excellent_standard: 'An Excellent answer defines MPS as amino acid incorporation into new muscle proteins, explains the causal chain: resistance exercise and dietary protein independently activate MPS through mechanical tension and leucine sensing respectively, and together produce synergistic activation. It addresses what happens when MPS is chronically insufficient relative to breakdown: net protein balance turns negative and muscle is lost despite training, explaining why protein distribution — not just total intake — matters for maximizing discrete MPS pulses across the day.'
    },
    {
      term: 'Muscle Protein Breakdown',
      definition: 'The continuous degradation of existing muscle proteins. Always occurring simultaneously with synthesis.',
      why: 'Hypertrophy only happens when synthesis exceeds breakdown over the full 24-hour cycle, not just during the post-training window.',
      excellent_standard: 'An Excellent answer defines MPB as the continuous degradation of existing muscle proteins occurring simultaneously with synthesis, explains that it is regulated by catabolic hormones and fasting state — not just exercise — and addresses the critical implication: hypertrophy requires net positive balance across the full 24-hour cycle. If synthesis is elevated briefly while breakdown continues at a high rate during prolonged fasting between meals, the net result may be neutral or negative despite strong training and adequate total protein intake.'
    },
    {
      term: 'Net Protein Balance',
      definition: 'The difference between muscle protein synthesis and breakdown over a given time period. Positive balance over time means muscle gain.',
      why: 'The entire root question is about what determines net protein balance across the day — same total protein, different distribution, different balance.',
      excellent_standard: 'An Excellent answer defines net protein balance as the synthesis minus breakdown differential over time, explains the causal implication: total daily protein is necessary but insufficient — the timing and distribution determines how many discrete synthesis pulses occur, and breakdown continues between pulses regardless of total intake. The consequence of ignoring net balance: two athletes with identical protein consumption can have dramatically different hypertrophy outcomes based entirely on whether each meal crosses the leucine threshold to trigger a full synthesis pulse.'
    },
    {
      term: 'mTORC1',
      definition: 'Mechanistic target of rapamycin complex 1. The central anabolic signaling hub that integrates exercise and nutrient signals to activate muscle protein synthesis.',
      why: 'The specific molecular mechanism by which protein distribution affects hypertrophy independent of total intake — it is activated in discrete pulses, one per threshold-crossing meal.',
      excellent_standard: 'An Excellent answer defines mTORC1 as the central anabolic signaling hub activated by both mechanical tension and leucine sensing, explains that it acts as an integrator: when activated, it phosphorylates downstream targets that initiate ribosomal protein synthesis. The key causal point: mTORC1 is activated in discrete pulses — each activation event triggers a synthesis window that lasts 1 to 3 hours then returns to baseline regardless of continued amino acid availability. This pulsatile nature is why distributing protein across 4 meals produces more total synthesis than 2 meals with the same total protein — 4 activation events versus 2.'
    },
    {
      term: 'Leucine',
      definition: 'The essential amino acid that most powerfully activates mTORC1. Functions as the primary cellular sensor for protein availability.',
      why: 'The mechanism by which meal protein distribution affects synthesis — each meal needs sufficient leucine to cross the activation threshold for mTORC1.',
      excellent_standard: 'An Excellent answer defines leucine as the primary mTORC1-activating amino acid and cellular protein availability sensor, explains the causal chain: leucine activates the Ragulator-Rag complex upstream of mTORC1, triggering the full anabolic signaling cascade. The threshold nature is critical: sub-threshold leucine doses fail to trigger full mTORC1 activation regardless of total amino acid availability. Once the threshold is crossed and mTORC1 is maximally activated, additional leucine produces no additive effect — explaining why very large single protein meals do not proportionally outperform moderate well-distributed meals.'
    },
    {
      term: 'Leucine Threshold',
      definition: 'The minimum dose of leucine per meal required to maximally activate mTORC1 and trigger a full muscle protein synthesis pulse.',
      why: 'Explains why spreading the same protein across more meals produces more synthesis opportunities than concentrating it in fewer large meals.',
      excellent_standard: 'An Excellent answer defines the leucine threshold as the minimum leucine dose for maximal mTORC1 activation, explains that trained individuals have a higher threshold than untrained — requiring more protein per meal to trigger the same synthesis response — and addresses the consequence: as training age increases, the same protein distribution that maximized synthesis in a beginner becomes sub-threshold, requiring larger protein doses per meal or more frequent higher-protein meals to maintain the same number of maximal synthesis pulses per day.'
    },
    {
      term: 'Anabolic Signaling',
      definition: 'The molecular cascade from exercise or nutrient stimulus through mTORC1 to ribosomal activation and protein synthesis.',
      why: 'The mechanistic chain connecting training and nutrition to actual muscle growth — understanding the pathway explains why both inputs are necessary for maximal synthesis.',
      excellent_standard: 'An Excellent answer defines anabolic signaling as the molecular cascade from stimulus through mTORC1 to protein synthesis, explains the two independent upstream inputs — mechanical tension via PI3K-Akt and leucine via Ragulator-Rag — converging on mTORC1, and addresses the consequence of pathway disruption: if either upstream input is blocked while the other is intact, synthesis is attenuated; if both are present simultaneously, activation is supraadditive. This explains why post-workout protein intake produces greater hypertrophy than the same protein intake at rest.'
    },
    {
      term: 'Myofibrillar Hypertrophy',
      definition: 'Increase in the size and number of contractile myofibrils within muscle fibers.',
      why: 'The type of hypertrophy most associated with strength gains and the primary target of progressive resistance training.',
      excellent_standard: 'An Excellent answer defines myofibrillar hypertrophy as increased contractile myofibril content, explains the causal chain: mechanical tension from resistance training activates mTORC1 which drives synthesis of actin and myosin proteins, adding contractile units and directly increasing force production capacity. The consequence of promoting sarcoplasmic over myofibrillar hypertrophy: muscle size increases without proportional strength gain because the added volume is non-contractile rather than additional force-generating cross-bridge sites.'
    },
    {
      term: 'Sarcoplasmic Hypertrophy',
      definition: 'Increase in the volume of fluid and non-contractile proteins surrounding the myofibrils within a muscle fiber.',
      why: 'Contributes to visible muscle size without proportional strength increase — the distinction is essential for explaining Branch 3\'s identical hypertrophy with different strength outcomes.',
      excellent_standard: 'An Excellent answer defines sarcoplasmic hypertrophy as increased non-contractile fluid and protein volume, explains that it contributes to visible muscle size without adding contractile units, and addresses the consequence: two training programs producing identical total hypertrophy can produce different strength outcomes if they preferentially drive different hypertrophy types. High-volume metabolic training tends toward sarcoplasmic hypertrophy; heavy progressive overload toward myofibrillar — explaining why Program A in Branch 3 produces greater strength despite identical muscle size.'
    },
    {
      term: 'Protein Distribution',
      definition: 'The pattern of protein intake across meals throughout the day.',
      why: 'The central variable in the root question — same total protein distributed differently across 2 versus 4 meals produces different synthesis outcomes through leucine threshold mechanics.',
      excellent_standard: 'An Excellent answer defines protein distribution as the meal-by-meal pattern of protein intake, explains the causal mechanism: each meal crossing the leucine threshold triggers one discrete mTORC1 activation event and synthesis pulse, making the number of threshold-crossing meals the key variable rather than total daily protein. The consequence of poor distribution — two large meals versus four moderate meals — is fewer total synthesis pulses despite identical total protein, producing measurably less hypertrophy over time, with this effect more pronounced in trained individuals due to their higher leucine threshold.'
    }
  ],
  6: [
    {
      term: 'Stroke Volume',
      definition: 'The volume of blood ejected by the left ventricle per heartbeat.',
      why: 'The structural adaptation that drives every other cardiovascular change in the root question — stroke volume increase is the cause; resting heart rate decrease is the mathematical consequence.',
      excellent_standard: 'An Excellent answer defines stroke volume as blood ejected per heartbeat, explains the causal chain: endurance training increases end-diastolic volume through eccentric cardiac hypertrophy, enabling more blood to fill and be ejected each beat. The downstream consequences: since resting cardiac output is relatively fixed, resting heart rate must fall as stroke volume rises — not independently but as a mathematical consequence. If stroke volume is impaired, heart rate must increase to maintain cardiac output, explaining why resting heart rate is a proxy for cardiac efficiency rather than an independent adaptation.'
    },
    {
      term: 'Cardiac Output',
      definition: 'Heart rate multiplied by stroke volume. The total volume of blood pumped per minute.',
      why: 'The central variable in the Fick equation determining oxygen delivery capacity and the basis for calculating the pacemaker athlete\'s new performance ceiling in Branch 1.',
      excellent_standard: 'An Excellent answer defines cardiac output as heart rate times stroke volume and identifies it as the central determinant of oxygen delivery capacity, addresses the causal consequence of fixing heart rate with a pacemaker: maximal cardiac output is severely constrained regardless of stroke volume, and the Fick equation dictates that VO2 max must fall proportionally unless arteriovenous oxygen difference compensates — which has physiological limits. This makes maximal cardiac output the primary performance ceiling for the pacemaker athlete.'
    },
    {
      term: 'VO2 Max',
      definition: 'Maximum oxygen consumption rate. The product of maximal cardiac output and arteriovenous oxygen difference.',
      why: 'The performance metric whose improvement over 8 months is explained by both central cardiac and peripheral oxygen extraction adaptations.',
      excellent_standard: 'An Excellent answer defines VO2 max as the product of cardiac output and a-vO2 difference per the Fick equation, explains that both central and peripheral components contribute, and addresses the consequence of improving one while limiting the other: the pacemaker athlete with constrained cardiac output cannot compensate fully through peripheral adaptations. VO2 max improvements from training come from both increased stroke volume and improved peripheral extraction, which is why peripheral adaptations persist longer into detraining than central cardiac changes.'
    },
    {
      term: 'Eccentric Hypertrophy',
      definition: 'Enlargement of the heart\'s chambers through increased end-diastolic volume. The primary cardiac structural adaptation to endurance training.',
      why: 'The specific structural change that increases stroke volume and thereby mathematically reduces resting heart rate as a consequence.',
      excellent_standard: 'An Excellent answer defines eccentric hypertrophy as chamber enlargement from volume overload — the heart repeatedly filling with more blood during endurance training — explains the causal chain: increased end-diastolic volume stretches the ventricle, triggering sarcomere addition in series that permanently enlarges chamber size, allowing greater filling and ejection per beat. The consequence distinguishing it from concentric hypertrophy: wall thickening without chamber enlargement improves ejection pressure but not volume per beat, explaining why resistance and endurance training produce structurally opposite cardiac adaptations.'
    },
    {
      term: 'End-Diastolic Volume',
      definition: 'The volume of blood in the ventricle just before contraction. Increased by eccentric cardiac hypertrophy.',
      why: 'Directly determines stroke volume — more blood in the ventricle before contraction means more blood ejected per beat.',
      excellent_standard: 'An Excellent answer defines end-diastolic volume as ventricular filling volume before contraction, explains the direct causal relationship: greater EDV means more blood available for ejection per beat, which directly increases stroke volume assuming normal ejection fraction. The consequence of reduced EDV: stroke volume falls, requiring heart rate to increase to maintain cardiac output, reducing cardiac efficiency. Endurance training chronically increases EDV through eccentric hypertrophy, making it the structural foundation of all cardiovascular improvements observed in the root question.'
    },
    {
      term: 'Resting Heart Rate',
      definition: 'Heart rate at complete rest. Decreases with endurance training as a mathematical consequence of increased stroke volume, not as an independent adaptation.',
      why: 'Not an independent adaptation — cardiac output at rest stays constant while stroke volume rises, so heart rate must fall by mathematical necessity.',
      excellent_standard: 'An Excellent answer defines resting heart rate and explicitly identifies it as a derived consequence rather than an independent adaptation, explains the mathematical relationship: resting cardiac output is relatively fixed at approximately 5L/min; as stroke volume increases, heart rate must fall proportionally to maintain the same output. The consequence of misunderstanding this: assuming heart rate training is what reduces resting HR, when in reality improving stroke volume through endurance training is the actual mechanism — heart rate is just responding mathematically to the stroke volume increase.'
    },
    {
      term: 'Fick Equation',
      definition: 'VO2 max equals cardiac output multiplied by arteriovenous oxygen difference. The equation linking oxygen delivery and extraction to maximal aerobic capacity.',
      why: 'Allows calculation of the pacemaker athlete\'s new VO2 max ceiling and explains why both cardiac and peripheral adaptations contribute to aerobic fitness.',
      excellent_standard: 'An Excellent answer defines the Fick equation as VO2 max = cardiac output × a-vO2 difference, explains both components causally: cardiac output determines oxygen delivery ceiling and a-vO2 difference determines extraction efficiency at the tissue level. The consequence for the pacemaker athlete: with maximal cardiac output severely constrained, the only compensation is maximizing a-vO2 difference through peripheral adaptations — but this has physiological limits, and the new VO2 max ceiling is calculable from the equation using the constrained cardiac output and maximally adapted a-vO2 difference.'
    },
    {
      term: 'Arteriovenous Oxygen Difference',
      definition: 'The difference in oxygen content between arterial and venous blood. Reflects how much oxygen working muscles extract from each liter of blood delivered.',
      why: 'The peripheral variable that explains why the elite 20-year-old athlete has superior VO2 max per unit cardiac output compared to the older trained individual in Branch 3.',
      excellent_standard: 'An Excellent answer defines a-vO2 difference as the oxygen extraction fraction per unit of blood flow, explains the causal mechanism: mitochondrial density, capillary density, and oxidative enzyme activity determine how much oxygen muscle can extract from each liter of blood delivered. The consequence for comparing athletes: an elite athlete with high peripheral adaptations extracts more oxygen per liter of cardiac output than a less-trained individual, producing higher VO2 max from the same cardiac output — explaining why the older trained individual needs more cardiac output per unit of oxygen consumed.'
    },
    {
      term: 'Cardiac Adaptation',
      definition: 'Structural and functional changes in the heart produced by chronic exercise training.',
      why: 'The mechanism connecting months of endurance training to improved exercise capacity and explaining why different training modalities produce structurally opposite cardiac responses.',
      excellent_standard: 'An Excellent answer defines cardiac adaptation as chronic structural and functional changes in response to training demands, explains the causal chain: repeated volume overload during endurance training drives eccentric hypertrophy while pressure overload during resistance training drives concentric hypertrophy. The consequence of understanding this distinction: predicting cardiac morphology in concurrent training athletes, understanding why detraining reverses some changes faster than others, and explaining why cardiac adaptations take months to develop but begin reversing within weeks of detraining.'
    },
    {
      term: 'Detraining',
      definition: 'The partial reversal of training adaptations following cessation or significant reduction of exercise.',
      why: 'The root question asks specifically about the sequence and rate of detraining across three cardiovascular variables — each reverses on a different timeline.',
      excellent_standard: 'An Excellent answer defines detraining as adaptation reversal after training cessation, explains the differential timeline: plasma volume decreases within days, reducing venous return and stroke volume quickly; VO2 max declines more slowly because peripheral adaptations — mitochondrial and capillary density — persist longer than central cardiac changes; resting heart rate rises as the mathematical consequence of falling stroke volume. The consequence of misunderstanding the detraining sequence: athletes returning from a break may underestimate their cardiovascular fitness because early plasma volume loss temporarily reduces stroke volume and performance before the slower-reversing peripheral adaptations begin to decline.'
    }
  ],
  7: [
    {
      term: 'Tendon',
      definition: 'Dense connective tissue connecting muscle to bone. Transmits contractile force to the skeleton.',
      why: 'The structure whose adaptation lags behind cardiovascular and muscular adaptation during rapid training load increases, explaining the runner\'s injury despite improving fitness.',
      excellent_standard: 'An Excellent answer defines tendon as the force-transmitting connective tissue between muscle and bone, explains the causal consequence of its limited vascularity: slow nutrient and signaling molecule delivery to tenocytes means collagen remodeling and adaptation proceed on a much longer timeline than muscle or cardiovascular adaptation. If training load increases faster than tendon remodeling can accommodate, cumulative microtrauma exceeds repair capacity and tendinopathy develops — not because the tendon is inherently weak but because its adaptation timeline was exceeded by the training ramp rate.'
    },
    {
      term: 'Collagen',
      definition: 'The primary structural protein of tendons and ligaments. Type I collagen dominates tendon architecture and is synthesized by tenocytes in response to mechanical loading.',
      why: 'Collagen synthesis rate is the rate-limiting factor in tendon adaptation and the reason connective tissue injury risk rises during rapid fitness gains.',
      excellent_standard: 'An Excellent answer defines collagen as the primary structural tendon protein, explains the causal chain: mechanical loading stimulates tenocytes to synthesize new Type I collagen fibers aligned along stress lines and cross-linked to increase tensile strength. The consequence of collagen synthesis being rate-limited: even with adequate loading stimulus, the tendon cannot structurally adapt faster than tenocytes can produce and organize collagen — making rapid load increases inherently risky because the structural upgrade timeline cannot be compressed regardless of training intensity.'
    },
    {
      term: 'Tenocyte',
      definition: 'The primary cell type in tendons. Responsible for collagen synthesis and matrix remodeling in response to mechanical loading.',
      why: 'Tenocyte mechanotransduction is the cellular mechanism of tendon adaptation and its relative slowness explains why the runner develops tendinopathy despite adequate overall fitness.',
      excellent_standard: 'An Excellent answer defines tenocytes as the tendon-specific cells responsible for collagen production and matrix maintenance, explains the causal basis of their slowness: tenocytes are sparsely distributed in a relatively avascular matrix, limiting both their activity rate and the substrate delivery needed for collagen synthesis. The consequence: tendon adaptation cannot be accelerated by increasing training intensity the way muscular hypertrophy can — the cellular machinery is the bottleneck, not training stimulus magnitude, making load management the only effective strategy for injury prevention during rapid fitness development.'
    },
    {
      term: 'Mechanotransduction',
      definition: 'The process by which cells convert mechanical loading into biochemical signals that drive structural adaptation.',
      why: 'The mechanism by which exercise stimulates tenocyte collagen synthesis and why loading frequency matters more than peak load magnitude for tendon adaptation.',
      excellent_standard: 'An Excellent answer defines mechanotransduction as the cellular conversion of mechanical strain into biochemical adaptation signals, explains the specific relevance to tendon: tenocytes sense deformation through cytoskeletal strain, activating signaling cascades that upregulate collagen gene expression and synthesis. The consequence for tendon adaptation: cyclical loading frequency — not peak load magnitude — most effectively drives tenocyte mechanotransduction, because moderate repeated deformations activate synthesis more consistently than infrequent high-magnitude loads.'
    },
    {
      term: 'Tendinopathy',
      definition: 'A painful degenerative condition of the tendon resulting from failed adaptation to cumulative load. Characterized by collagen fiber disorganization, not primarily inflammation.',
      why: 'The condition the runner develops — a structural failure of tendon remodeling to keep pace with training load, not an inflammatory response.',
      excellent_standard: 'An Excellent answer defines tendinopathy as degenerative failed adaptation — not inflammation — explains the causal mechanism: when cumulative loading exceeds tenocyte repair and remodeling capacity, collagen fiber disorganization and matrix degeneration occur rather than structural strengthening. The consequence of misclassifying it as inflammatory: anti-inflammatory treatment addresses the wrong mechanism, explaining why NSAIDs and rest provide temporary symptom relief but do not resolve the underlying degenerative process. Appropriate treatment — progressive loading — works because it stimulates tenocyte collagen synthesis to address the actual structural deficit.'
    },
    {
      term: 'Connective Tissue Adaptation',
      definition: 'Structural changes in tendons, ligaments, and fascia in response to mechanical loading over time.',
      why: 'Adapts to training load on a longer timeline than muscle or cardiovascular fitness, creating a window of injury vulnerability during periods of rapid fitness improvement.',
      excellent_standard: 'An Excellent answer defines connective tissue adaptation as load-driven structural changes in tendons, ligaments, and fascia, explains the critical timing differential: muscle can measurably adapt within 2 to 4 weeks while tendons require months of consistent loading to structurally remodel. The consequence creates a dangerous mismatch window: an athlete can gain significant muscular strength and endurance capacity before connective tissues have adapted to the forces that improved musculature can now generate — creating elevated injury risk precisely when fitness is improving most rapidly.'
    },
    {
      term: 'Collagen Synthesis',
      definition: 'The production of new collagen fibers by tenocytes in response to mechanical loading. The rate-limiting step in tendon structural adaptation.',
      why: 'The rate-limited process that determines how quickly tendons can adapt to increased training loads — it cannot be accelerated beyond a biological ceiling.',
      excellent_standard: 'An Excellent answer defines collagen synthesis as tenocyte-driven production of new structural fibers, explains the causal consequence of its rate limitation: there is a maximum synthesis rate that cannot be exceeded regardless of loading stimulus magnitude, making time — not just training load — the irreducible variable in tendon adaptation. The consequence for injury prevention: a longer timeline with appropriate loading is not a compromise — it is the only physiologically valid approach because the cellular synthesis machinery defines an absolute biological ceiling on adaptation speed that training intensity cannot overcome.'
    },
    {
      term: 'Remodeling',
      definition: 'The ongoing process of breaking down existing collagen and replacing it with new collagen. Occurs continuously in tendons even without injury.',
      why: 'Remodeling rate determines both adaptation speed during training and recovery speed after injury — the same tenocyte activity governs both.',
      excellent_standard: 'An Excellent answer defines remodeling as continuous collagen turnover — breakdown and replacement — explains that it is ongoing even without injury, and addresses the causal implication: injury recovery speed depends on the same tenocyte remodeling rate that governs adaptation speed, explaining why tendon injuries heal slowly. The consequence of this continuous remodeling: tendons are in constant dynamic equilibrium, and training shifts this equilibrium toward net collagen gain if loading is appropriate, or toward net degeneration if loading exceeds repair capacity.'
    },
    {
      term: 'Load Management',
      definition: 'The practice of controlling the rate of training load increase to remain within tissue adaptation capacity.',
      why: 'The correct intervention for the runner — not rest, but controlled progressive loading that keeps rate of increase within tenocyte synthesis capacity.',
      excellent_standard: 'An Excellent answer defines load management as controlling the rate of training load increase to match the slowest-adapting tissue — tendon — rather than the fastest, explains the causal logic: tendons can only synthesize collagen at a fixed rate, so any increase faster than this rate creates cumulative structural deficit. The consequence of rest as an alternative: removing load stops collagen synthesis stimulus while eliminating the degradation signal, producing no net adaptation improvement and leaving the athlete structurally unprepared for the loads they will return to. Progressive load management is mechanistically superior because it keeps loading within tolerance while continuously stimulating adaptation.'
    },
    {
      term: 'Tissue Tolerance',
      definition: 'The maximum load a connective tissue can handle without structural degradation exceeding repair rate.',
      why: 'Exceeded tissue tolerance produces tendinopathy. Load management progressively raises the tolerance ceiling rather than simply staying below a fixed limit.',
      excellent_standard: 'An Excellent answer defines tissue tolerance as the load ceiling above which structural degradation exceeds repair, explains the dynamic nature: tolerance is not fixed — appropriate progressive loading raises the ceiling over time as collagen density and organization improve. The consequence of treating tolerance as fixed: either excessive caution preventing adaptation, or repeated injury from not recognizing that the ceiling has risen with training. Optimal load management targets loads challenging enough to stimulate collagen synthesis while remaining below the current tolerance ceiling, progressively raising both simultaneously.'
    }
  ],
  8: [
    {
      term: 'Progressive Overload',
      definition: 'The principle that training stimulus must increase over time to continue driving adaptation.',
      why: 'The foundational principle explaining why Athlete A\'s highly specific but unchanging protocol produces inferior results to Athlete B\'s broader, varied approach.',
      excellent_standard: 'An Excellent answer defines progressive overload as the requirement for increasing training stimulus to continue driving adaptation, explains the causal basis: once adapted to a given stimulus, the body no longer treats it as a meaningful stressor and adaptation plateaus. The consequence for Athlete A: repeating identical 400m repeats at the same pace and volume quickly becomes a maintenance stimulus — the body has adapted to exactly that demand and no further improvement occurs without changing the stimulus, explaining why Athlete B\'s varied approach continues driving adaptation while Athlete A plateaus.'
    },
    {
      term: 'Specificity Principle',
      definition: 'The principle that physiological adaptations are specific to the exact demands placed on the body during training.',
      why: 'Explains why Athlete A improves at 400 meters from 400-meter training but also why excessive specificity limits overall adaptation breadth.',
      excellent_standard: 'An Excellent answer defines specificity as adaptations mirroring the exact demands of training, explains the dual implication: highly specific training produces the most targeted adaptations for a given task but also exhausts those specific adaptation pathways fastest and provides no stimulus to adjacent systems that also contribute to performance. The consequence of excessive specificity: early rapid gains from specific adaptation followed by plateau as the specific system is fully adapted and unstimulated adjacent systems become limiting — explaining why Athlete B\'s less specific program produces superior long-term results.'
    },
    {
      term: 'Overtraining Syndrome',
      definition: 'A state of accumulated fatigue and hormonal disruption from chronic training stress without adequate recovery, producing performance decline rather than improvement.',
      why: 'The endpoint of prolonged linear progressive overload without adequate variation or recovery — the specific risk that periodization prevents.',
      excellent_standard: 'An Excellent answer defines overtraining syndrome as performance decline from accumulated training stress without adequate recovery, explains the causal mechanism: sustained high training volume and intensity create chronically elevated cortisol, suppressed testosterone, CNS fatigue, and connective tissue microtrauma that cannot resolve between sessions. The consequence for the advanced athlete on linear progression: adding load every session eventually exceeds recovery capacity, producing overtraining syndrome rather than continued adaptation — which is why periodization with intentional recovery phases is necessary for advanced athletes.'
    },
    {
      term: 'Adaptation',
      definition: 'A structural or functional change in response to a training stimulus that improves the body\'s capacity to handle that stimulus in the future.',
      why: 'The entire purpose of training and the variable that periodization is designed to maximize by keeping stimuli progressive and varied.',
      excellent_standard: 'An Excellent answer defines adaptation as a stimulus-driven structural or functional change that improves capacity to handle that stimulus, explains the causal requirement: the stimulus must be novel or progressive — the body only adapts to demands that exceed current capacity. The consequence: once fully adapted to a stimulus, continued exposure produces maintenance not further improvement. This is the foundational principle behind periodization — systematically varying stimuli ensures adaptation continues across multiple systems rather than plateauing in any single one.'
    },
    {
      term: 'Periodization',
      definition: 'The systematic variation of training variables — volume, intensity, specificity — over time to maximize adaptation while managing accumulated fatigue.',
      why: 'The solution to the problem of linear progressive overload producing diminishing returns and injury risk for advanced athletes in Branch 2.',
      excellent_standard: 'An Excellent answer defines periodization as planned variation of training variables across time, explains the causal logic: varying stimuli prevents any single adaptation pathway from reaching full saturation while allowing accumulated fatigue to dissipate during lower-intensity phases, enabling continued adaptation. The consequence of not periodizing: linear load increases eventually exceed recovery capacity producing overtraining or injury; plateaus emerge as specific pathways saturate; and the hormonal environment becomes chronically catabolic from sustained high stress without recovery phases.'
    },
    {
      term: 'Training Age',
      definition: 'The number of years an athlete has trained consistently. Determines how much stimulus variation is required for continued adaptation.',
      why: 'Determines how the specificity-variability tradeoff shifts — beginners respond to almost anything, advanced athletes need increasingly varied and sophisticated stimuli.',
      excellent_standard: 'An Excellent answer defines training age as years of consistent training, explains the causal implication: higher training age means more adaptation pathways have been developed, leaving fewer easily tapped sources of improvement — making novel varied stimuli increasingly necessary for continued progress. The consequence for the specificity-variability tradeoff: a beginner can improve dramatically from almost any specific training because most systems are undertrained; an advanced athlete has adapted to most common stimuli and requires carefully designed varied programming to find remaining adaptation headroom.'
    },
    {
      term: 'Accumulated Fatigue',
      definition: 'The buildup of systemic and local fatigue from high training volume over time that masks true performance capacity.',
      why: 'The specific variable the taper in Branch 3 allows to dissipate, revealing the fitness that was built underneath during the high-volume phase.',
      excellent_standard: 'An Excellent answer defines accumulated fatigue as progressive systemic and local fatigue from high training volume, explains the causal masking effect: fitness and fatigue both accumulate during high-volume training — fitness builds slowly and persistently while fatigue accumulates faster; the net performance expressed is fitness minus fatigue, so high fatigue makes true fitness appear lower than it is. The consequence for tapering: reducing volume without reducing intensity allows fatigue to dissipate rapidly while fitness is maintained, revealing the full fitness capacity that was built under the fatigued state — explaining the 6% performance improvement from volume reduction alone.'
    },
    {
      term: 'Detraining',
      definition: 'Partial reversal of training adaptations following cessation or significant reduction of training.',
      why: 'Branch 1 asks specifically about which adaptations are genuinely lost versus simply suppressed during 4 weeks of complete rest — the distinction determines how quickly fitness can be restored.',
      excellent_standard: 'An Excellent answer defines detraining as adaptation reversal after training cessation and distinguishes genuinely lost from suppressed adaptations, explains the causal distinction: suppressed adaptations — plasma volume, enzyme activity, glycogen storage capacity — decline quickly but restore rapidly because the underlying structural capacity remains; genuinely lost adaptations — capillary density, myonuclear number after months of detraining — require full re-adaptation timelines. The consequence: 4 weeks of detraining produces rapid apparent fitness loss that partially reverses quickly on resuming training, while 6 months produces structural regression requiring full adaptation timelines to restore.'
    },
    {
      term: 'Supercompensation',
      definition: 'The temporary period after adequate recovery where performance capacity transiently exceeds the pre-training baseline.',
      why: 'The physiological basis of the taper effect — removing accumulated fatigue allows the fitness that was built during high-volume training to fully express.',
      excellent_standard: 'An Excellent answer defines supercompensation as the temporary performance overshoot above pre-training baseline following adequate recovery, explains the causal mechanism: training creates a temporary performance decrement from fatigue while simultaneously driving upward adaptation; if recovery is complete before the next stimulus, performance is temporarily elevated above baseline before returning to the new adapted level. The consequence for tapering: the taper captures this supercompensation phase — after high-volume training has driven adaptation, reduced volume allows fatigue clearance and the supercompensation peak to coincide with competition.'
    },
    {
      term: 'Taper',
      definition: 'A planned reduction in training volume while maintaining intensity in the period before competition or testing.',
      why: 'The intervention in Branch 3 that produces a 6% strength improvement by removing accumulated fatigue rather than adding fitness.',
      excellent_standard: 'An Excellent answer defines taper as planned volume reduction with maintained intensity pre-competition, explains the causal logic: volume reduction dissipates accumulated fatigue rapidly while maintained intensity preserves neural drive and the training adaptation signal, and addresses the optimal parameters: approximately 2 to 3 weeks duration with 40 to 60% volume reduction — shorter tapers fail to fully clear fatigue, longer tapers allow detraining to begin offsetting the fatigue clearance benefit. The specific consequence of volume reduction without maintained intensity: fitness declines alongside fatigue, producing no net performance improvement.'
    },
    {
      term: 'Stimulus Recovery Adaptation',
      definition: 'The three-part cycle underlying all training: a stimulus is applied, recovery allows adaptation to occur, and the adaptation produces improved capacity for the next cycle.',
      why: 'The foundational model explaining why both too little training and too much training produce suboptimal outcomes — the system requires all three phases.',
      excellent_standard: 'An Excellent answer defines the SRA cycle as the fundamental training loop — stimulus, recovery, adaptation — explains the causal consequence of disrupting each phase: too little stimulus produces no adaptation signal; inadequate recovery prevents adaptation from expressing; insufficient stimulus progression prevents continued adaptation after initial gains. The consequence of misunderstanding which phase is limiting: athletes in overtraining add more stimulus when recovery is the actual deficiency; undertrained athletes increase rest when stimulus insufficiency is the problem. Diagnosing which SRA phase is compromised is the core skill of intelligent training program design.'
    }
  ]
};

export const BRANCH_RUBRICS = {
  1: {
    branch_1: `Criterion 1: Identifies neural adaptations — motor unit recruitment, rate coding, and synchronization — as the primary mechanism of strength and power gain without fiber type change. Criterion 2: Identifies structural adaptations — myofibrillar density increase and connective tissue stiffness — as secondary contributors to the power increase. Criterion 3: Correctly predicts neural adaptations reach their ceiling first at approximately 8 to 12 weeks while structural adaptations continue to accrue beyond that point.`,
    branch_2: `Criterion 1: Correctly predicts higher testosterone amplifies hypertrophy response more in Type II dominant muscle than Type I dominant muscle through androgen receptor density differences. Criterion 2: Identifies that the sprinter's higher Type II fiber content means more androgen receptors per unit volume available to respond to the hormonal signal. Criterion 3: Explains that the same hormonal signal produces different structural outcomes based on receptor availability in the target tissue — not hormone concentration — so the signal is identical while the responder tissue differs.`,
    branch_3: `Criterion 1: Correctly explains that powerlifting's long rest periods, sub-maximal sustained tension, and low rep ranges select for fatigue resistance over time, allowing Type I fiber preservation despite the sport requiring maximal force. Criterion 2: Identifies rate of force development and peak force production as distinct qualities with different fiber type dependencies — Type II fibers are critical for RFD but not exclusively for peak force at slow contraction velocities. Criterion 3: Correctly predicts the powerlifter outperforms the sprinter on absolute peak force production but underperforms on rate of force development measured by the slope of the force-time curve.`
  },
  2: {
    branch_1: `Criterion 1: Correctly identifies lactate threshold — or critical power — as the metabolic variable that best explains the performance difference despite identical VO2 max values. Criterion 2: Predicts the faster athlete has a higher lactate threshold as a percentage of VO2 max — meaning they can sustain higher fractions of maximal aerobic capacity before accumulation exceeds clearance. Criterion 3: Correctly describes the faster athlete's lactate curve as shifted rightward on the intensity axis — the inflection point occurs at a higher absolute or relative workload.`,
    branch_2: `Criterion 1: Correctly identifies the phosphocreatine system as dominant in the first 0 to 10 seconds and the glycolytic system as dominant from approximately 10 seconds through the 300-meter mark, with aerobic contribution increasing in the final 100 meters. Criterion 2: Identifies hydrogen ion accumulation and inorganic phosphate accumulation — not lactate itself — as the primary metabolic drivers of neuromuscular fatigue causing the final 100-meter slowdown. Criterion 3: Assigns the slowdown to specific metabolic causation rather than motivational explanation — the athlete is not slowing down by choice but by involuntary contractile impairment.`,
    branch_3: `Criterion 1: Correctly identifies improved neuromuscular power output and running economy — not aerobic capacity — as the primary mechanisms by which sprint training improves endurance performance. Criterion 2: Identifies enhanced PCr resynthesis rate or improved muscle buffering capacity as sprint-specific adaptations that transfer to reduced relative intensity during endurance effort. Criterion 3: Does not attribute the improvement to changes in VO2 max or aerobic enzyme activity — correctly frames the improvement pathway as non-aerobic.`
  },
  3: {
    branch_1: `Criterion 1: Correctly distinguishes the upper motor neuron pathway — corticospinal tract — controlling voluntary movement from brainstem and spinal pathways controlling involuntary pattern-generated movements like yawning. Criterion 2: Correctly identifies that yawning activates a brainstem-mediated motor pattern generator that bypasses the damaged cortical pathway, which is why the muscle contracts involuntarily but not voluntarily. Criterion 3: Correctly predicts that motor relearning and neuroplasticity-based rehabilitation targeting cortical reorganization and voluntary pathway restoration is the most efficient rehabilitation approach — not strengthening the muscle, which is already intact.`,
    branch_2: `Criterion 1: Correctly identifies rate coding — the speed at which motor units reach peak firing frequency — as the primary neuromuscular characteristic distinguishing weightlifters from powerlifters in ballistic force production tasks. Criterion 2: Explains that weightlifting-specific training with ballistic intent develops the nervous system's ability to reach peak motor unit firing frequency faster, shortening the time to peak force. Criterion 3: Predicts that weightlifting-specific training shifts the force-time curve leftward — high-threshold units are recruited sooner and reach peak firing rate sooner, improving RFD without necessarily increasing peak force.`,
    branch_3: `Criterion 1: Correctly identifies fatigue-driven motor unit escalation under Henneman's size principle as the mechanism — as low-threshold units fatigue their force output drops and the nervous system recruits progressively higher-threshold units to maintain total force. Criterion 2: Correctly predicts that proximity to failure equates the hypertrophic stimulus between low-load-to-failure and high-load-stopped-short-of-failure protocols because high-threshold motor unit recruitment is the common mechanism in both. Criterion 3: Does not attribute high-threshold motor unit recruitment at low loads to the load magnitude itself — correctly frames it as fatigue-driven recruitment escalation.`
  },
  4: {
    branch_1: `Criterion 1: Correctly identifies that chronically low resting testosterone creates a suboptimal androgenic baseline between training sessions — not just during acute response — meaning the inter-session anabolic environment is persistently compromised. Criterion 2: Identifies androgen receptor downregulation or downstream signaling cascade impairment — specifically reduced mTORC1 activation amplitude — as the point where the deficit manifests rather than at the hormone secretion step. Criterion 3: Does not attribute the blunted hypertrophy solely to blunted acute hormonal response magnitude — correctly identifies the problem as chronic baseline deficiency affecting the hours between sessions.`,
    branch_2: `Criterion 1: Correctly identifies cortisol's primary role during endurance training as substrate mobilization — liberating glucose and fatty acids for sustained energy provision rather than tissue remodeling. Criterion 2: Correctly identifies that chronically elevated resting cortisol creates a net catabolic state by chronically elevating muscle protein breakdown rate, tipping the protein balance negative outside of training windows. Criterion 3: Correctly explains that the temporal relationship between cortisol and anabolic hormones determines net protein balance — acute cortisol during training followed by anabolic recovery is adaptive; chronically elevated baseline cortisol without adequate anabolic counterbalance is catabolic.`,
    branch_3: `Criterion 1: Correctly identifies overnight growth hormone secretion during deep sleep as the specific recovery window where the hormonal divergence between athletes is greatest — the sleep-deprived athlete loses the primary nocturnal GH pulse. Criterion 2: Identifies IGF-1 as the downstream mediator of growth hormone's anabolic effect on muscle protein synthesis, linking the GH deficit to reduced local anabolic signaling. Criterion 3: Predicts nocturnal growth hormone area under the curve — total GH secreted during sleep — as the single measurement that would most clearly differentiate the two athletes' recovery environments.`
  },
  5: {
    branch_1: `Criterion 1: Correctly identifies the cross-education effect operating through shared neural pathways — bilateral cortical activation during unilateral training sends some neural drive to the contralateral limb — as a mechanism attenuating atrophy in the immobilized arm. Criterion 2: Identifies systemic anabolic hormonal environment — elevated IGF-1 and testosterone from intensive unilateral training — as a second contributing pathway providing partial systemic anabolic signal to the immobilized muscle. Criterion 3: Correctly predicts that the cross-education effect is meaningful enough to reduce atrophy rate but insufficient to maintain full strength without direct training stimulus to that limb.`,
    branch_2: `Criterion 1: Correctly identifies that resistance exercise activates mTORC1 through a mechanical tension pathway — mechanotransduction via Akt — while leucine activates mTORC1 through a distinct amino acid sensing pathway via the Ragulator-Rag complex, and these are genuinely separate upstream inputs converging on mTORC1. Criterion 2: Correctly predicts that combining both stimuli produces supraadditive mTORC1 activation because both upstream pathways converge simultaneously, amplifying downstream signaling beyond either alone. Criterion 3: Correctly identifies that the timing effect diminishes in highly trained individuals because chronic training elevates baseline mTORC1 sensitivity throughout the day, compressing the window advantage that beginners experience.`,
    branch_3: `Criterion 1: Correctly identifies mechanical tension and metabolic stress as the shared drivers of hypertrophic stimulus in both programs — not load magnitude specifically — explaining why identical hypertrophy is possible through mechanically different loading approaches. Criterion 2: Correctly explains that Program A produces superior strength gains because progressive load increase specifically adapts the nervous system and connective tissue to heavier absolute loads, an adaptation Program B does not provide at the same rate. Criterion 3: Does not attribute identical hypertrophy to identical load schemes — correctly identifies that the actual driver is the mechanical and metabolic stimulus reaching muscle fibers regardless of the specific loading strategy used.`
  },
  6: {
    branch_1: `Criterion 1: Correctly applies the Fick equation — VO2 max equals cardiac output multiplied by arteriovenous oxygen difference — to calculate the new VO2 max given the fixed maximum heart rate constraint of 70 bpm and the known stroke volume, arriving at a substantially reduced value. Criterion 2: Correctly identifies that arteriovenous oxygen difference becomes the most limiting component given cardiac output is now severely constrained by the fixed heart rate ceiling. Criterion 3: Correctly predicts that sprint and short middle distance performance are most severely impacted because they depend most heavily on maximal cardiac output, while ultra-endurance events operating at lower fractions of maximum are comparatively less impacted.`,
    branch_2: `Criterion 1: Correctly identifies eccentric hypertrophy in endurance athletes — increased chamber volume from volume overload — and concentric hypertrophy in strength athletes — increased wall thickness from pressure overload — as mechanistically opposite cardiac responses to different mechanical demands. Criterion 2: Correctly predicts that a concurrent training athlete develops an intermediate cardiac phenotype with both increased chamber volume and moderate wall thickening rather than one or the other. Criterion 3: Correctly identifies the combined phenotype as advantageous because it provides both high stroke volume from large chamber size and adequate ejection pressure from moderately thickened walls — each modality's cardiac adaptation is additive not competitive.`,
    branch_3: `Criterion 1: Correctly identifies peripheral oxygen extraction — arteriovenous oxygen difference — as the variable explaining why the older trained individual requires more cardiac output per unit of oxygen consumed. Criterion 2: Correctly identifies mitochondrial density, capillary density, and oxidative enzyme activity as the peripheral adaptations responsible for the elite athlete's superior oxygen extraction per unit of blood flow. Criterion 3: Correctly frames the older trained individual's higher cardiac output requirement as reflecting less efficient peripheral oxygen extraction — the heart must pump more blood to deliver the same amount of oxygen to working muscle.`
  },
  7: {
    branch_1: `Criterion 1: Correctly identifies higher baseline collagen fibril diameter, collagen density, and greater cross-link maturity in Athlete A's pre-injury ligament as the structural differences produced by years of training — a more robust collagen matrix. Criterion 2: Correctly identifies mechanotransduction through fibroblast and ligamentocyte activity as the cellular mechanism — repeated mechanical loading stimulates these cells to produce and organize more and better-quality collagen over training years. Criterion 3: Correctly predicts that the recovered ligament does not fully return to pre-injury structural quality — scar tissue collagen has inferior fiber organization and cross-linking compared to native ligament collagen, even with excellent rehabilitation.`,
    branch_2: `Criterion 1: Correctly identifies that stiffer tendons transmit force from muscle to bone more rapidly by reducing the elastic lag — the brief delay while compliant tendon takes up before force is transmitted — thereby reducing electromechanical delay. Criterion 2: Correctly identifies rate of force development enhancement — the slope of the force-time curve — as the specific mechanical advantage of tendon stiffness rather than an increase in peak force capacity itself. Criterion 3: Correctly predicts that an athlete with high muscular strength but undertrained tendon stiffness will show a delayed and blunted force-time curve — they eventually produce high peak force but the rate at which force rises is compromised, limiting explosive performance.`,
    branch_3: `Criterion 1: Correctly identifies cyclical loading frequency — the total number of loading cycles — rather than peak force magnitude as the primary driver of tendon collagen synthesis rate. Criterion 2: Correctly identifies that moderate cyclical loading activates tenocyte mechanotransduction more consistently and repeatedly than infrequent high-load events — the accumulated mechanical stimulus over many cycles outweighs intermittent high peaks. Criterion 3: Correctly predicts an optimal return-to-sport tendon conditioning protocol that prioritizes high-repetition moderate-load exercises before progressing to high-load low-repetition work — building collagen synthesis capacity before imposing peak force demands.`
  },
  8: {
    branch_1: `Criterion 1: Correctly identifies that neuromuscular adaptations — motor pattern efficiency, calcium handling — and biochemical adaptations — enzyme activity, plasma volume expansion — are suppressed or reduced rather than structurally lost during 4 weeks, enabling rapid restoration once training resumes. Criterion 2: Correctly distinguishes genuinely lost adaptations — such as partial capillary regression and some mitochondrial density reduction — from suppressed or downregulated adaptations that restore faster, explaining why restoration in 3 weeks is possible but not all adaptations recover equally quickly. Criterion 3: Correctly predicts that 6-month detraining produces genuine structural regression — significant myonuclear loss, capillary regression, and connective tissue remodeling — requiring a full adaptation timeline to restore, not the rapid restoration seen after 4 weeks.`,
    branch_2: `Criterion 1: Correctly identifies that accumulated fatigue — CNS fatigue, connective tissue microtrauma, and hormonal suppression from sustained high volume — masks true strength capacity during the high-volume training phase, making performance appear plateaued when underlying fitness is still improving. Criterion 2: Correctly identifies that maintaining training intensity during a taper preserves the neural drive and fitness signal while the reduction in volume allows accumulated fatigue to dissipate, unmasking the fitness that was hidden underneath. Criterion 3: Correctly predicts that optimal taper parameters are approximately 2 to 3 weeks duration with 40 to 60 percent volume reduction while keeping intensity at or above pre-taper levels — enough to clear fatigue without allowing significant detraining.`,
    branch_3: `Criterion 1: Correctly identifies fatigue dissipation as the primary physiological mechanism of the performance increase — the taper removes accumulated fatigue that was suppressing neuromuscular expression of true fitness. Criterion 2: Correctly distinguishes fitness and fatigue as separate variables that both accumulate during high-volume training — fitness builds slowly, fatigue accumulates faster, and the taper selectively removes fatigue while preserving fitness. Criterion 3: Correctly predicts optimal taper parameters of 2 to 3 weeks duration and approximately 40 to 60 percent volume reduction while maintaining intensity, and identifies that tapers shorter than 2 weeks fail to fully clear fatigue while tapers longer than 3 weeks begin allowing meaningful detraining.`
  }
};

export const ROOT_DIFFICULTY_MAP = {
  1: 'mechanistic',
  2: 'mechanistic',
  3: 'mechanistic',
  4: 'mechanistic',
  5: 'mechanistic',
  6: 'mechanistic',
  7: 'applied',
  8: 'applied'
};