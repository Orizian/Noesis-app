export const ROOTS = [
  {
    id: 1,
    title: "Muscle Fiber Architecture and Force Production",
    rootQuestion: `A sprinter and a marathon runner have identical total quadriceps muscle volume confirmed by MRI. During a maximal sprint the sprinter produces 340 watts of peak power. The marathon runner produces 180 watts peak power from the same muscle volume. Neither athlete is injured. Explain the specific structural difference in muscle fiber composition that accounts for this power differential, explain why fiber type produces this difference mechanistically rather than just correlating with it, and predict what would happen to each athlete's power output and fatigue rate if both performed a 45-minute moderate intensity cycling session immediately before the sprint test.`,
    branches: [
      {
        label: "Edge Case",
        question: `A previously sedentary person begins a 16-week resistance training program. Muscle biopsies taken before and after show no significant change in the ratio of Type I to Type II fibers. Yet their peak power output has increased by 35 percent. Explain the specific structural and neural adaptations that produced this power increase without fiber type conversion, and predict which of these adaptations reached its ceiling first.`
      },
      {
        label: "Cross-Root Integration",
        question: `The sprinter from the root question also has a significantly higher testosterone response to resistance training than the marathon runner. Using your understanding of both muscle fiber architecture and hormonal response to exercise, predict how the hormonal difference interacts with the existing fiber type composition to affect hypertrophy potential in each athlete, and explain why the same hormonal signal produces different structural outcomes in fiber-type-different muscles.`
      },
      {
        label: "Counterintuitive Prediction",
        question: `A muscle biopsy of an elite powerlifter shows that 60 percent of their vastus lateralis fibers are Type I slow-twitch despite their sport demanding maximal force production. Explain why this finding is less surprising than it initially appears, identify the specific training characteristic of powerlifting that selects for this fiber composition, and predict how this powerlifter's performance would compare to a sprinter on a test of maximal force production versus rate of force development.`
      }
    ],
    rubric: "Identifies Type I vs Type II fiber distinction as the mechanism. Connects fiber type to contractile speed and fatigue resistance mechanistically not just definitionally. Predicts pre-fatigue effect on both athletes using fiber type logic. Addresses power differential as structural not motivational."
  },
  {
    id: 2,
    title: "Energy Systems and Their Interaction",
    rootQuestion: `A cyclist is performing a 20-minute time trial at maximum sustainable effort. At the 30-second mark their power output is 420 watts. At the 5-minute mark it has dropped to 310 watts. At the 15-minute mark it has stabilized at 285 watts. They are not pacing — they are going as hard as possible at each moment. Explain the specific energy system transitions that account for this power output curve, identify the metabolic event that causes the drop from 420 to 310 watts specifically, and predict what the power output curve would look like if the same athlete performed the same test after 3 days of carbohydrate restriction to deplete muscle glycogen.`,
    branches: [
      {
        label: "Edge Case",
        question: `Two athletes have identical VO2 max values of 65 ml/kg/min. In a 10km race one athlete runs 32 minutes and the other runs 38 minutes. Using energy system principles explain what specific metabolic variable best explains this performance difference despite identical maximal aerobic capacity, and predict how each athlete's lactate curve would look during an incremental exercise test.`
      },
      {
        label: "Cross-Root Integration",
        question: `The phosphocreatine system and the glycolytic system both contribute to a 400-meter sprint. Using your understanding of energy systems and muscle fiber architecture predict how the relative contribution of each system changes across the 400 meters, explain why the dramatic slowdown in the final 100 meters of most 400-meter races is a metabolic event not a motivational one, and identify the specific metabolic accumulation that drives this slowdown.`
      },
      {
        label: "Counterintuitive Prediction",
        question: `An endurance athlete performs 8 weeks of sprint interval training — 6 second maximal sprints with 4 minute recovery — with no changes to their steady-state aerobic training. Their 10km race time improves by 90 seconds despite the interval training never stressing their aerobic system significantly. Explain the specific adaptations from sprint interval training that improve endurance performance through a non-aerobic mechanism.`
      }
    ],
    rubric: "Correctly identifies the three energy system transitions across the time trial. Identifies PCr depletion as the specific mechanism for the early power drop. Predicts glycogen depletion effects on both the aerobic and anaerobic contributions correctly."
  },
  {
    id: 3,
    title: "Neuromuscular Activation and Motor Unit Recruitment",
    rootQuestion: `A powerlifter attempts a maximal deadlift of 250kg — a weight they have lifted before. On the first attempt they fail at the sticking point. On the second attempt 4 minutes later they successfully complete the lift. Their muscle strength has not changed between attempts. Explain the specific neuromuscular mechanism that allowed the second attempt to succeed where the first failed, identify what changed in the nervous system between attempts rather than in the muscle, and predict what would happen to their maximal lift capacity if they performed 30 minutes of light cardio immediately before the third attempt.`,
    branches: [
      {
        label: "Edge Case",
        question: `A stroke patient has lost the ability to voluntarily activate the left bicep despite the muscle being completely intact — no atrophy, normal histology, normal response to direct electrical stimulation. Yet when the patient yawns, the left bicep contracts involuntarily. Explain the specific neurological distinction between voluntary and involuntary motor activation that accounts for this pattern, and predict what rehabilitation approach would most efficiently restore voluntary control.`
      },
      {
        label: "Cross-Root Integration",
        question: `Elite weightlifters produce higher peak forces than equally strong powerlifters during ballistic movements despite having similar one-rep max scores. Using your understanding of both motor unit recruitment and muscle fiber architecture explain the specific neuromuscular characteristic that accounts for this difference in rate of force development, and predict how training each quality specifically changes the recruitment pattern over time.`
      },
      {
        label: "Counterintuitive Prediction",
        question: `A researcher measures motor unit recruitment during a set of bicep curls taken to failure with a light weight — 30 percent of one rep max. Early in the set only low-threshold motor units are active. By the final repetitions before failure, high-threshold motor units are fully recruited despite the load being only 30 percent of maximum. Explain the specific mechanism that forces high-threshold motor unit recruitment at low loads when taken to failure, and predict the hypertrophy stimulus of this protocol compared to a heavy set at 85 percent of one rep max stopped well short of failure.`
      }
    ],
    rubric: "Identifies rate coding and motor unit synchronization as what changed between attempts not muscle strength. Addresses the post-activation potentiation mechanism. Predicts cardio effect using the mechanism of neural fatigue rather than muscular fatigue."
  },
  {
    id: 4,
    title: "Acute Hormonal Response to Training",
    rootQuestion: `Two athletes perform resistance training sessions of identical volume — same exercises, sets, reps, and total tonnage. Athlete A performs the session as straight sets with 3 minutes rest between sets over 60 minutes. Athlete B performs the same volume as supersets with 60 seconds rest between exercises over 35 minutes. Blood samples taken immediately after each session show dramatically different hormonal profiles — Athlete B has significantly higher testosterone, growth hormone, and cortisol. Both athletes have trained for 5 years. Explain the specific training variable that drives the hormonal difference, predict whether the higher hormonal response in Athlete B produces greater muscle protein synthesis over the following 48 hours, and explain why the answer to that prediction is less straightforward than it initially appears.`,
    branches: [
      {
        label: "Edge Case",
        question: `A 45-year-old male athlete has resting testosterone levels 40 percent below the normal range for his age despite excellent health, nutrition, and sleep. His resistance training produces a normal acute hormonal response — testosterone rises appropriately during and after training. Yet his hypertrophy response to training over 12 weeks is significantly blunted compared to age-matched peers with normal testosterone. Explain the specific mechanism by which chronically low resting testosterone blunts hypertrophy despite normal acute response, and identify at what point in the muscle protein synthesis cascade the deficit manifests.`
      },
      {
        label: "Cross-Root Integration",
        question: `Cortisol rises acutely during both resistance training and endurance training. Using your understanding of hormonal response and energy systems explain why acute cortisol elevation during training serves a different metabolic function in resistance versus endurance contexts, predict the consequence of chronically elevated resting cortisol on muscle protein balance, and explain why the timing of cortisol elevation relative to anabolic hormones determines whether the net effect is catabolic or anabolic.`
      },
      {
        label: "Counterintuitive Prediction",
        question: `Two athletes have identical training programs and nutrition. Athlete A sleeps 8 hours per night consistently. Athlete B sleeps 5.5 hours per night. After 12 weeks Athlete B has gained significantly less muscle despite identical training stimulus and caloric intake. A muscle biopsy shows identical rates of muscle protein synthesis in both athletes measured immediately after training sessions. Explain where in the 24-hour recovery cycle the hormonal difference between athletes is producing the divergent outcomes, and predict the specific hormonal measurement that would most clearly explain the difference.`
      }
    ],
    rubric: "Identifies metabolic stress and hormonal milieu as the driver of hormonal difference. Addresses the distinction between acute hormonal spike and chronic anabolic environment. Predicts sleep deprivation effect at the hormonal synthesis level not just the training level."
  },
  {
    id: 5,
    title: "Muscle Protein Synthesis and the Hypertrophy Signal",
    rootQuestion: `A researcher gives two groups of subjects identical resistance training programs for 16 weeks. Group A consumes 1.6 grams of protein per kilogram of bodyweight daily evenly distributed across 4 meals. Group B consumes the same total daily protein in 2 meals — a small breakfast and a large dinner. Both groups gain strength equally. Group A gains significantly more muscle mass. Explain the specific molecular mechanism by which protein distribution affects muscle protein synthesis independent of total protein intake, identify the signaling pathway that is differentially activated, and predict the minimum meal protein dose required to maximally stimulate this pathway in a trained individual versus an untrained individual.`,
    branches: [
      {
        label: "Edge Case",
        question: `A bodybuilder tears their left bicep completely at the musculotendinous junction and undergoes surgical repair. During the 12-week immobilization period they continue training the right arm intensively. At 12 weeks the right arm has gained 2cm of circumference. Surprisingly the left arm, while atrophied, has lost less muscle than predicted by immobilization research. Explain the specific mechanism by which intensive unilateral training attenuates contralateral muscle atrophy, identify the neural and systemic pathways responsible, and predict whether this cross-education effect is sufficient to meaningfully affect rehabilitation outcomes.`
      },
      {
        label: "Cross-Root Integration",
        question: `mTORC1 is the primary anabolic signaling hub for muscle protein synthesis. Both resistance exercise and leucine from dietary protein activate mTORC1. Using your understanding of muscle protein synthesis and hormonal response to training explain why combining resistance exercise and protein intake produces greater mTORC1 activation than either stimulus alone, predict the optimal timing window between training and protein intake for maximal synergistic activation, and explain why this timing effect diminishes in highly trained individuals compared to beginners.`
      },
      {
        label: "Counterintuitive Prediction",
        question: `A study compares two hypertrophy programs over 6 months. Program A uses traditional progressive overload — adding weight each week. Program B keeps weight constant but increases reps until a set becomes easy then adds a small weight increment. Both programs equate total volume. At 6 months muscle biopsies show identical hypertrophy. However subjects in Program B report significantly lower perceived exertion and better recovery. Explain why identical hypertrophy outcomes are possible through mechanically different loading approaches, identify what the actual driver of the hypertrophic stimulus is in both programs, and predict which program would produce greater strength gains despite identical hypertrophy.`
      }
    ],
    rubric: "Identifies leucine threshold and mTORC1 activation as the mechanism. Connects protein distribution to pulsatile mTORC1 activation versus sustained low-level activation. Addresses the trained versus untrained leucine threshold difference."
  },
  {
    id: 6,
    title: "Cardiovascular Adaptation to Endurance Training",
    rootQuestion: `An untrained 25-year-old begins an 8-month endurance training program. At baseline their resting heart rate is 72 bpm, stroke volume is 70ml, and VO2 max is 38 ml/kg/min. After 8 months their resting heart rate is 48 bpm, stroke volume is 105ml, and VO2 max is 52 ml/kg/min. Their maximum heart rate has not changed. Explain the specific structural cardiac adaptation that accounts for the stroke volume increase, explain why resting heart rate decreases as a mathematical consequence of stroke volume increase rather than as an independent adaptation, and predict what happens to each of these three variables during the first 3 weeks of complete detraining.`,
    branches: [
      {
        label: "Edge Case",
        question: `A competitive cyclist with a VO2 max of 72 ml/kg/min and resting heart rate of 38 bpm develops a cardiac arrhythmia requiring a pacemaker set at a fixed rate of 70 bpm. Their maximum achievable heart rate is now 70 bpm — well below the normal maximum. Predict their new VO2 max and explain the specific cardiovascular equation that determines this value, identify which component of the Fick equation is most limiting in this scenario, and predict how this athlete's performance across different event durations — sprint versus middle distance versus ultra-endurance — changes relative to their pre-pacemaker capacity.`
      },
      {
        label: "Cross-Root Integration",
        question: `Endurance training and resistance training produce opposing cardiac adaptations — eccentric versus concentric hypertrophy. Using your understanding of cardiovascular adaptation and the energy systems explain why the mechanical demand of each training modality produces structurally opposite cardiac responses, predict the cardiac morphology of an athlete who trains both modalities equally at high volume, and explain why the combined cardiac phenotype is actually advantageous rather than a compromise.`
      },
      {
        label: "Counterintuitive Prediction",
        question: `A 50-year-old sedentary individual begins endurance training and after one year achieves a VO2 max of 45 ml/kg/min — above average for their age. An elite 20-year-old endurance athlete has a VO2 max of 78 ml/kg/min. The older trained individual's cardiac output at maximal exercise is actually higher relative to their VO2 max than the elite athlete's. Explain the specific cardiovascular variable that accounts for this — why the older trained individual needs more cardiac output per unit of oxygen consumed than the elite athlete — and predict what peripheral adaptation in the elite athlete explains their superior oxygen extraction efficiency.`
      }
    ],
    rubric: "Identifies eccentric cardiac hypertrophy and increased end-diastolic volume as the structural basis of stroke volume increase. Derives resting heart rate decrease mathematically from stroke volume increase using the cardiac output equation. Predicts detraining sequence correctly — stroke volume reverses faster than VO2 max."
  },
  {
    id: 7,
    title: "Connective Tissue Adaptation",
    rootQuestion: `A 28-year-old recreational runner increases their weekly mileage from 30km to 60km over 6 weeks in preparation for a marathon. At week 5 they develop Achilles tendinopathy — pain and morning stiffness at the Achilles tendon insertion. Their cardiovascular fitness has improved normally throughout this period. The tendon has not ruptured. Explain the specific structural reason why connective tissue adaptation lags behind cardiovascular and muscular adaptation during rapid training load increases, identify the cellular mechanism responsible for tendon remodeling and why it is rate-limited, and predict what training modification would allow this athlete to reach 60km per week without developing tendinopathy given a longer timeline.`,
    branches: [
      {
        label: "Edge Case",
        question: `Two athletes sustain identical grade 2 medial collateral ligament sprains of the knee. Athlete A has been resistance training for 6 years. Athlete B has been sedentary. MRI confirms equivalent ligament damage in both. At 12 weeks Athlete A has returned to full sport while Athlete B is still in rehabilitation. Both athletes had identical rehabilitation programs. Explain the specific pre-injury structural differences in Athlete A's ligament that account for the faster recovery, identify the cellular mechanism that produced these structural differences through training, and predict whether the recovered ligament in Athlete A returns to its pre-injury structural quality.`
      },
      {
        label: "Cross-Root Integration",
        question: `Heavy resistance training produces both muscular hypertrophy and increased tendon stiffness. Using your understanding of connective tissue adaptation and neuromuscular activation explain why increased tendon stiffness is actually advantageous for force production rather than simply being a parallel adaptation, identify the specific mechanical property of stiff tendons that enhances rate of force development, and predict the performance consequence for an athlete who has high muscular strength but undertrained tendon stiffness.`
      },
      {
        label: "Counterintuitive Prediction",
        question: `A researcher compares tendon collagen synthesis rates in athletes performing heavy resistance training versus moderate intensity endurance training matched for total lower limb mechanical loading. The endurance training group shows higher rates of tendon collagen synthesis despite lower peak forces. Explain the specific loading characteristic — not peak force — that most strongly drives tendon collagen synthesis, identify what property of cyclical loading at moderate force is a stronger collagen synthesis stimulus than infrequent loading at high force, and predict the optimal tendon conditioning protocol for an athlete returning from tendon injury.`
      }
    ],
    rubric: "Identifies tenocyte remodeling rate as the rate-limiting factor. Explains the vascularity deficit of tendon compared to muscle as the mechanistic basis of slower adaptation. Predicts the correct training modification using load management principles not rest."
  },
  {
    id: 8,
    title: "Training Principles: Overload, Specificity, and Recovery",
    rootQuestion: `Two athletes both want to improve their 400-meter sprint time. Athlete A runs 400-meter repeats at race pace 4 times per week. Athlete B runs a variety of distances — 100m, 200m, 400m, and 800m repeats — at varied intensities 5 times per week with one session per week of heavy resistance training. After 16 weeks Athlete A has improved their 400m time by 1.8 seconds. Athlete B has improved by 3.1 seconds. Both athletes recovered well with no injuries. Explain the specific training principle that accounts for Athlete B's superior improvement despite less specific training, predict which athlete has a higher ceiling for further improvement at the 400-meter distance, and explain why the optimal specificity ratio changes as an athlete approaches their genetic potential.`,
    branches: [
      {
        label: "Edge Case",
        question: `A highly trained athlete takes a planned 4-week complete rest period — no training whatsoever. At the end of 4 weeks their VO2 max has dropped by 8 percent, their strength has dropped by 4 percent, and their body composition has changed minimally. They resume training and within 3 weeks are back to all baseline measures. Explain the specific mechanisms that allow such rapid restoration of fitness, identify what structural adaptations are genuinely lost versus simply suppressed during detraining, and predict how the detraining and retraining response would differ for an athlete who takes a 6-month break rather than 4 weeks.`
      },
      {
        label: "Cross-Root Integration",
        question: `Progressive overload requires continually increasing training stress to drive adaptation. Using your understanding of both training principles and hormonal response explain why linear progressive overload — adding weight every session — works well for beginners but produces diminishing returns and increasing injury risk for advanced athletes, identify the specific hormonal and structural reason the adaptation curve flattens, and predict the optimal periodization structure for an advanced athlete that maintains progressive overload without requiring linear load increases every session.`
      },
      {
        label: "Counterintuitive Prediction",
        question: `A strength athlete reduces their training volume by 40 percent for 3 weeks while maintaining training intensity — same weights, fewer sets. At the end of the taper their performance on a maximal strength test improves by 6 percent compared to their pre-taper baseline. Explain the specific physiological mechanism by which reducing training volume while maintaining intensity produces a performance increase rather than a decrease, identify what was accumulating during the high-volume training phase that was masking true strength capacity, and predict the optimal taper duration and volume reduction percentage for maximizing this effect.`
      }
    ],
    rubric: "Identifies concurrent training and varied stimulus as the mechanism behind Athlete B's superior improvement through the principle of varied adaptation stimulus. Addresses the specificity-variability tradeoff and how it shifts with training age. Predicts taper effect through the accumulated fatigue masking fitness concept."
  }
];

export const BRANCH_RUBRICS = {
  1: {
    branch_1: "Identifies neural adaptations (rate coding, synchronization) and structural changes (pennation angle, fascicle length) as sources of power increase without fiber type conversion. Correctly identifies neural adaptations as reaching ceiling first.",
    branch_2: "Connects higher testosterone response to Type II fiber androgen receptor density. Explains differential hypertrophy potential based on fiber type composition and hormonal sensitivity. Identifies why the same hormonal signal produces different structural outcomes.",
    branch_3: "Explains that powerlifting's low-velocity, long-duration contractions favor Type I fiber recruitment and adaptation. Distinguishes maximal force production (where the powerlifter excels) from rate of force development (where the sprinter excels)."
  },
  2: {
    branch_1: "Identifies lactate threshold as the key differentiating variable despite identical VO2 max. Correctly predicts different lactate curve shapes — earlier versus later inflection point. Connects fractional utilization to endurance performance.",
    branch_2: "Correctly maps PCr dominance in early meters transitioning to glycolytic dominance. Identifies hydrogen ion and inorganic phosphate accumulation as the specific metabolic drivers of the final 100m slowdown. Connects fiber type to energy system contribution.",
    branch_3: "Identifies neuromuscular power, muscle buffer capacity, or PCr recovery rate improvements as non-aerobic mechanisms that improve endurance performance. Explains how improved anaerobic capacity reduces relative intensity at submaximal speeds."
  },
  3: {
    branch_1: "Correctly distinguishes corticospinal (voluntary) from subcortical/brainstem (involuntary) motor pathways. Identifies the lesion location as cortical/corticospinal. Predicts rehabilitation using neuroplasticity principles targeting voluntary pathway recovery.",
    branch_2: "Identifies rate of force development as dependent on both motor unit firing rate and fiber type composition. Explains that weightlifters train ballistic intent producing faster recruitment patterns. Predicts training-specific changes in recruitment speed.",
    branch_3: "Identifies Henneman's size principle and fatigue-driven recruitment as the mechanism. Explains that as low-threshold units fatigue, the nervous system must recruit high-threshold units to maintain force output. Correctly compares hypertrophy stimulus of both protocols."
  },
  4: {
    branch_1: "Identifies that chronic testosterone provides the baseline androgenic environment for protein synthesis between training sessions. Explains that acute spikes are transient while the chronic deficit affects the 24-hour MPS response. Identifies androgen receptor saturation or downstream signaling as the deficit point.",
    branch_2: "Distinguishes cortisol's role in glucose mobilization during endurance versus tissue remodeling during resistance training. Correctly predicts chronic cortisol elevation leading to net protein breakdown. Explains the temporal relationship between cortisol and anabolic hormones.",
    branch_3: "Identifies the nocturnal growth hormone pulse and overnight testosterone synthesis as the specific hormonal events disrupted by sleep restriction. Explains that the deficit occurs during the recovery window not the training window. Predicts GH or testosterone as the key measurement."
  },
  5: {
    branch_1: "Identifies the cross-education effect through both neural (bilateral cortical activation) and systemic (circulating myokines, hormonal) pathways. Correctly assesses the magnitude as meaningful but partial. Predicts rehabilitation benefit.",
    branch_2: "Explains the convergent activation of mTORC1 through mechanical (resistance exercise) and nutritional (leucine) inputs via different upstream pathways. Addresses the 0-3 hour timing window. Explains why trained individuals have a blunted and shorter MPS response.",
    branch_3: "Identifies mechanical tension and volume as the actual driver of hypertrophy in both programs. Explains that progressive overload method is less important than achieving sufficient mechanical stimulus. Predicts Program A produces greater strength gains due to neural specificity to heavy loads."
  },
  6: {
    branch_1: "Correctly applies the Fick equation (VO2 = HR × SV × a-vO2 difference) to predict the new VO2 max with fixed HR. Identifies cardiac output as the primary limitation. Predicts minimal sprint impact but severe middle-distance and endurance impact.",
    branch_2: "Explains volume overload (endurance) versus pressure overload (resistance) as the mechanical basis for eccentric versus concentric hypertrophy. Predicts a mixed cardiac phenotype. Explains why increased chamber size with increased wall thickness is advantageous.",
    branch_3: "Identifies arteriovenous oxygen difference (a-vO2 diff) as the variable explaining the discrepancy. Explains that the elite athlete extracts more oxygen per unit of blood flow due to superior capillary density and mitochondrial density."
  },
  7: {
    branch_1: "Identifies greater collagen cross-linking, collagen density, and potentially larger cross-sectional area in Athlete A's pre-injury ligament. Explains mechanotransduction through fibroblast activity as the training mechanism. Correctly predicts that the recovered ligament approaches but may not fully match pre-injury quality.",
    branch_2: "Explains that stiffer tendons transmit force more rapidly to bone, reducing electromechanical delay. Identifies the force transmission rate as the key mechanical property. Predicts injury risk and rate of force development deficit with undertrained tendons.",
    branch_3: "Identifies cumulative loading cycles (volume of loading) rather than peak force as the primary driver of tendon collagen synthesis. Explains that cyclical loading at moderate force provides more total mechanical stimulation to tenocytes. Predicts a high-rep, moderate-load protocol for tendon rehabilitation."
  },
  8: {
    branch_1: "Identifies muscle memory (myonuclear retention), maintained neural pathways, and structural preservation as mechanisms for rapid fitness restoration. Distinguishes between reversible detraining effects (plasma volume, enzyme activity) and slower losses (myonuclei, capillary density). Predicts that 6-month detraining produces genuine structural losses requiring longer retraining.",
    branch_2: "Identifies that beginners have high adaptive headroom making any progressive stimulus effective. Explains that advanced athletes have diminished hormonal response and structural adaptation capacity. Predicts undulating or block periodization as optimal for advanced athletes.",
    branch_3: "Identifies the fitness-fatigue model where accumulated fatigue masks underlying fitness. Explains that reducing volume removes fatigue while maintaining intensity preserves fitness. Predicts 2-3 week taper with 40-60 percent volume reduction as optimal."
  }
};