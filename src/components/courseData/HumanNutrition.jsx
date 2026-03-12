// humanNutritionFullCourseData.js
// Human Nutrition — Noesis Course Data
// Version: 3.0 — Universal schema applied

export const COURSE_META = {
  id: 'human-nutrition',
  title: 'Human Nutrition',
  description: 'A rigorous mechanistic course in human nutrition. Students develop genuine causal understanding of how energy balance, digestion, macronutrients, micronutrients, appetite, gut function, and dietary strategy interact to shape body composition, metabolic health, performance, and long-term outcomes. The course begins with a complete practical foundation and progressively advances toward higher-resolution nutritional reasoning.',
  tag: 'Nutrition',
  difficulty: 3,
  depth: 3,
  scope: 2,
  duration: 'long',
  learningMode: 'Mastery-Based',
  rootDifficultyMap: {
    1: 'foundational',
    2: 'foundational',
    3: 'foundational',
    4: 'foundational',
    5: 'mechanistic',
    6: 'mechanistic',
    7: 'mechanistic',
    8: 'mechanistic',
    9: 'applied',
    10: 'applied',
    11: 'applied'
  },
  sections: [
    {
      id: 1,
      title: 'Foundational Nutrition',
      summary: 'Builds a complete practical base in calories, body weight regulation, macronutrients, digestion, satiety, and sustainable diet construction.',
      rootIds: [1, 2, 3, 4]
    },
    {
      id: 2,
      title: 'Functional Nutrition',
      summary: 'Develops a systems-level understanding of glycemic control, protein turnover, dietary fat physiology, gut function, and why nutrition responses differ across contexts.',
      rootIds: [5, 6, 7, 8]
    },
    {
      id: 3,
      title: 'Advanced Nutrition',
      summary: 'Extends into adaptive metabolism, micronutrient physiology, performance nutrition, body composition strategy, and high-resolution reasoning about complex nutritional outcomes.',
      rootIds: [9, 10, 11]
    }
  ],
  rootSummaries: [
    {
      id: 1,
      title: 'Energy Balance and Body Weight Change',
      summary: 'Explains how body weight changes when energy intake and energy expenditure diverge, why this is true even when progress is nonlinear, and why scale change alone does not perfectly represent fat gain or fat loss.'
    },
    {
      id: 2,
      title: 'Macronutrients and Their Primary Roles',
      summary: 'Covers protein, carbohydrate, and fat as distinct but overlapping nutritional categories, explaining their major physiological roles and why they affect satiety, performance, body composition, and health differently.'
    },
    {
      id: 3,
      title: 'Digestion, Absorption, and Meal Processing',
      summary: 'Examines how food is mechanically and chemically broken down, absorbed, and distributed, and why the same meal can lead to different downstream effects depending on digestive function, activity state, and tissue demand.'
    },
    {
      id: 4,
      title: 'Satiety, Food Quality, and Sustainable Diet Construction',
      summary: 'Explains why some foods are easier to overeat than others, how satiety and palatability interact, and how practical diet structure determines whether nutritional knowledge can actually be sustained.'
    },
    {
      id: 5,
      title: 'Carbohydrate Metabolism and Glycemic Control',
      summary: 'Covers glucose handling, glycogen storage, insulin action, meal context, and why carbohydrate response depends heavily on tissue demand, insulin sensitivity, and dietary pattern.'
    },
    {
      id: 6,
      title: 'Protein Turnover, Lean Mass, and Recovery',
      summary: 'Explains how protein supports body structure, why intake distribution and total intake both matter, and how protein interacts with training, energy status, and satiety to influence muscle retention and adaptation.'
    },
    {
      id: 7,
      title: 'Dietary Fat, Lipids, and Energy Regulation',
      summary: 'Examines how dietary fat is digested, transported, stored, and used, and distinguishes between fat as a macronutrient, adipose tissue as storage, and blood lipid transport as a cardiovascular and metabolic issue.'
    },
    {
      id: 8,
      title: 'Fiber, Gut Function, and the Microbiome',
      summary: 'Explains how fiber type, fermentation, gut motility, microbial ecology, and digestive tolerance interact to affect GI comfort, satiety, stool quality, and metabolic health.'
    },
    {
      id: 9,
      title: 'Adaptive Metabolism and Diet Response Variability',
      summary: 'Explores why calorie deficits and surpluses do not always produce uniform outcomes, how energy expenditure adapts, and why hunger, movement, and physiology shift dynamically during dieting or overfeeding.'
    },
    {
      id: 10,
      title: 'Micronutrients, Deficiency Mechanisms, and Physiological Demand',
      summary: 'Covers vitamins and minerals as functional physiological tools rather than checklist items, explaining why deficiencies emerge in specific ways and how demand, absorption, and dietary restriction alter risk.'
    },
    {
      id: 11,
      title: 'Nutrition Strategy for Body Composition, Performance, and Adherence',
      summary: 'Integrates the course into applied diet design, showing how to build nutritional systems for fat loss, maintenance, muscle gain, recovery, and long-term sustainability without relying on fad logic.'
    }
  ]
};


export const ROOTS = [
  {
    id: 1,
    title: 'Energy Balance and Body Weight Change',
    rootQuestion: `A person claims they are eating "healthy" but their body weight has continued to rise for six months. They insist this proves calories do not matter because most of their food is minimally processed and high quality. Explain why food quality and energy balance are related but not interchangeable, identify the mechanism by which body mass still changes over time, and predict how body weight would respond if average energy intake remained above expenditure even while food quality improved.`,
    branches: [
      {
        label: 'Edge Case',
        question: `A person begins a calorie deficit and loses six pounds in the first week, then only loses one pound over the next three weeks despite consistent adherence. Explain why this does not mean energy balance stopped applying, identify the major short-term variable that changed fastest at the start of the diet, and predict which type of tissue loss is most likely dominating early scale movement.`
      },
      {
        label: 'Cross-Root Integration',
        question: `Two people each eat 2,400 kcal daily. One feels full and stable, while the other feels hungry constantly and struggles with adherence. Using energy balance and satiety principles, explain why identical calorie intake can produce very different real-world outcomes, identify the behavioral risk created by low satiety eating, and predict which person is more likely to drift into an energy surplus over time.`
      },
      {
        label: 'Counterintuitive Prediction',
        question: `A person starts resistance training while eating near maintenance calories and sees little change in scale weight over eight weeks, yet looks visibly leaner. Explain why this does not violate energy balance, identify the two body compartments most likely changing in opposite directions, and predict why the mirror can improve while scale weight remains similar.`
      },
      {
        label: 'Measurement Interpretation',
        question: `A person weighs themselves every morning for ten days during a calorie deficit and sees several days where body weight rises despite consistent intake and activity. Explain why this does not disprove energy balance, identify at least two short-term variables that can raise scale weight without representing fat gain, and predict what pattern would distinguish normal fluctuation from a true stall in fat loss.`
      }
    ],
    rubric: `Criterion 1: Explains clearly that food quality can influence health, satiety, and adherence, but does not replace the governing role of energy balance in body mass change. Criterion 2: Identifies sustained energy surplus as the reason body weight continues to rise over time. Criterion 3: Distinguishes body weight from body composition and explains why scale changes can conceal different tissue shifts. Criterion 4: Predicts that if intake remains above expenditure, body mass will continue trending upward even if food choices are "healthy" in other respects, and distinguishes short-term scale fluctuation from true tissue change, explaining why temporary daily increases do not automatically indicate fat gain.`
  },
  {
    id: 2,
    title: 'Macronutrients and Their Primary Roles',
    rootQuestion: `A person says protein, carbohydrates, and fat are basically interchangeable as long as total calories are matched. Explain why that statement is partially true for energy but incomplete physiologically, identify the primary functional role each macronutrient tends to play in the body, and predict which outcomes would change first if protein were cut very low while calories remained the same.`,
    branches: [
      {
        label: 'Edge Case',
        question: `A person dramatically increases carbohydrate intake while beginning a hard training block and suddenly gains three pounds in a few days. Explain why this does not necessarily represent fat gain, identify the storage form of carbohydrate responsible, and predict what associated body compartment changes alongside it.`
      },
      {
        label: 'Cross-Root Integration',
        question: `Two diets have equal calories, but Diet A is high in protein and fiber while Diet B is low in protein and highly refined. Explain why these diets may produce different hunger and adherence outcomes despite equal calories, identify the macronutrient most associated with structural repair, and predict which diet is easier to sustain during fat loss.`
      },
      {
        label: 'Counterintuitive Prediction',
        question: `A person switches to a very low fat diet to cut calories and initially feels fine, but after several months begins showing signs of hormonal disruption and poor fat-soluble vitamin status. Explain why fat intake can drop too low even on an otherwise adequate diet, identify the physiological functions that require dietary fat, and predict which class of micronutrients becomes increasingly at risk when fat intake is chronically insufficient.`
      }
    ],
    rubric: `Criterion 1: Explains that matched calories matter for energy balance but macronutrients are not physiologically interchangeable in their effects on structure, storage, satiety, and function. Criterion 2: Correctly identifies protein as most directly tied to tissue repair and turnover, carbohydrate as prominent for glycogen and energy supply, and fat as important for energy density, membranes, and absorption. Criterion 3: Predicts that low protein intake is likely to impair lean mass retention, recovery, and satiety before it changes scale weight in obvious ways.`
  },
  {
    id: 3,
    title: 'Digestion, Absorption, and Meal Processing',
    rootQuestion: `Two people eat the same meal containing steak, rice, avocado, and vegetables. One eats it after an overnight fast and remains sedentary. The other eats it soon after a hard training session. Explain how the digestive process is similar at first but why the absorbed nutrients are likely used differently afterward, identify the tissues most responsible for those differences, and predict which person directs more incoming carbohydrate toward immediate replenishment rather than storage.`,
    branches: [
      {
        label: 'Edge Case',
        question: `A person with poor pancreatic enzyme output eats a high-fat meal and later develops bloating, greasy stool, and poor weight maintenance. Explain the specific digestive breakdown that is failing, identify which visible symptom most strongly points toward fat malabsorption, and predict what nutrient class becomes increasingly risky to under-absorb over time because of this problem.`
      },
      {
        label: 'Cross-Root Integration',
        question: `A person slows eating speed dramatically and chews more thoroughly but keeps food choice and calories similar. Explain why fullness and GI comfort may improve even without major scale changes, identify which stage of the eating process changes most directly first, and predict which downstream behavior is most likely to improve before body composition changes.`
      },
      {
        label: 'Counterintuitive Prediction',
        question: `A person reports that eating the exact same calories in whole-food form feels much different than eating them in highly processed liquid form. Explain why this is not just psychological, identify the digestive and satiety mechanisms affected by food form, and predict which format is easier to overconsume rapidly.`
      }
    ],
    rubric: `Criterion 1: Explains that the initial digestive breakdown of the meal is broadly similar between the two people because the meal composition is the same, even though downstream effects may differ. Criterion 2: Explains that after absorption, nutrient use depends on physiological context, especially recent activity state and tissue demand. Criterion 3: Identifies major tissues involved in post-meal nutrient handling, especially skeletal muscle and liver. Criterion 4: Predicts that the recently trained person is more likely to direct more incoming carbohydrate toward replenishment because recent exercise increases tissue demand.`
  },
  {
    id: 4,
    title: 'Satiety, Food Quality, and Sustainable Diet Construction',
    rootQuestion: `A person repeatedly fails fat-loss diets not because they do not know what foods are "healthy," but because they become overwhelmingly hungry and eventually binge on highly palatable foods. Explain why satiety is a central nutrition variable rather than just a comfort issue, identify the food properties that tend to improve fullness per calorie, and predict what happens when a diet is theoretically effective but practically impossible to adhere to.`,
    branches: [
      {
        label: 'Edge Case',
        question: `A person follows a strict diet perfectly for five days then consumes far more calories than the weekly deficit would require in a two-day binge. Explain why the binary "good day / bad day" framing is mechanistically misleading, identify the physiological and behavioral drivers that accumulate during restriction and discharge during the binge, and predict what dietary design change would most reduce this pattern.`
      },
      {
        label: 'Cross-Root Integration',
        question: `Two diets both create the same paper calorie deficit. Diet A uses mostly lean protein, fruit, potatoes, beans, yogurt, and vegetables. Diet B uses small portions of refined snack foods and desserts. Explain why both may work in theory but not equally in practice, identify the variables most affecting adherence, and predict which diet is more stable over months rather than days.`
      },
      {
        label: 'Counterintuitive Prediction',
        question: `A person moves from constant snacking to three more structured meals and reports better appetite control even though daily calories do not change much. Explain why this is possible, identify the behavioral pattern that improved, and predict why structure itself can reduce overeating risk in some people.`
      },
      {
        label: 'Liquid Calories and Food Form',
        question: `A person says they do not eat very large meals, yet they consume many of their calories through sweet drinks, specialty coffees, shakes, and highly snackable foods and still struggle with hunger. Explain why calorie intake can rise without strong fullness signals in this pattern, identify the food-form or eating-behavior variables involved, and predict why this pattern can make fat loss harder even when the person does not feel like they are overeating in the usual sense.`
      }
    ],
    rubric: `Criterion 1: Explains that satiety determines whether an energy target can actually be maintained over time, making it central to diet success. Criterion 2: Identifies higher protein, higher fiber, lower energy density, and lower hyper-palatability as common satiety-supporting features. Criterion 3: Explains that food form and eating pattern — such as liquid calories, low-chewing foods, and highly snackable foods — can weaken fullness signaling and increase passive overconsumption risk. Criterion 4: Predicts that a diet which works only in theory but breaks adherence repeatedly will fail in real-world outcomes.`
  },
  {
    id: 5,
    title: 'Carbohydrate Metabolism and Glycemic Control',
    rootQuestion: `Two adults consume the same carbohydrate-rich meal. Person A is sedentary, sleep deprived, and insulin resistant. Person B is well-rested, physically active, and recently trained. Explain why their glucose response is unlikely to be the same, identify the major tissues and mechanisms responsible for clearing glucose from the blood, and predict which person requires a larger insulin response to normalize blood glucose.`,
    branches: [
      {
        label: 'Edge Case',
        question: `A person eating very low carbohydrate still shows somewhat elevated fasting glucose. Explain how this can occur without automatically proving worsening metabolic disease, identify the role of hepatic glucose output in the fasting state, and predict what additional marker would help distinguish adaptive glucose sparing from a more pathological state.`
      },
      {
        label: 'Cross-Root Integration',
        question: `A strength athlete places most carbohydrate intake around training, while a sedentary office worker consumes the same total carbohydrate in large late-night meals. Explain why the same daily carbohydrate total can produce different downstream outcomes, identify the role of glycogen demand, and predict which person tolerates larger carbohydrate doses with less disruption.`
      },
      {
        label: 'Counterintuitive Prediction',
        question: `A person improves post-meal glucose control significantly by walking after meals but loses little body weight. Explain why this is less surprising than it seems, identify the contraction-related mechanism involved, and predict which glucose measure is likely to improve first: fasting or postprandial.`
      },
      {
        label: 'Mixed Meal Context',
        question: `Two meals contain the same total grams of carbohydrate, but one is eaten alone while the other is eaten with protein, fiber, and fat and followed by a short walk. Explain why blood glucose response may differ despite matched carbohydrate grams, identify the meal-context and post-meal variables involved, and predict which meal pattern is likely to produce the smaller postprandial glucose spike.`
      }
    ],
    rubric: `Criterion 1: Explains that blood glucose response to the same carbohydrate meal can differ because glucose disposal depends on insulin sensitivity, recent activity, glycogen demand, meal context, and physiological state rather than carbohydrate grams alone. Criterion 2: Identifies major tissues involved in glucose handling, especially skeletal muscle and liver. Criterion 3: Predicts that the sedentary, insulin-resistant, sleep-deprived person is more likely to require a larger insulin response to normalize the same blood glucose load. Criterion 4: Explains that meal context and post-meal behavior — such as co-consumed protein, fat, fiber, and physical activity — can meaningfully alter postprandial glucose response even when carbohydrate grams are matched.`
  },
  {
    id: 6,
    title: 'Protein Turnover, Lean Mass, and Recovery',
    rootQuestion: `Two people eat the same total protein intake during a calorie deficit. Person A lifts weights and spreads protein across several meals. Person B does not train and eats most protein in one late meal. Both lose the same total scale weight. Explain why their lean mass outcomes are unlikely to match, identify the role of training and protein distribution, and predict which person retains more metabolically active tissue.`,
    branches: [
      {
        label: 'Edge Case',
        question: `A person dramatically increases protein intake but remains in a large chronic sleep deficit and recovers poorly from training. Explain why more protein alone may not fully solve the problem, identify the non-nutritional physiological process being neglected, and predict which adaptation pathway is still being limited.`
      },
      {
        label: 'Cross-Root Integration',
        question: `Two fat-loss diets have equal calories, but one is high protein and the other is low protein. Explain why the high-protein diet often improves both satiety and lean mass retention, identify the major structural advantage of adequate protein intake during dieting, and predict which diet leaves the person more vulnerable to ending the diet with a worse body composition.`
      },
      {
        label: 'Counterintuitive Prediction',
        question: `A novice lifter increases protein intake and training quality but sees scale weight rise slightly while looking firmer and leaner. Explain why this is not contradictory, identify the body compartment that likely improved, and predict why focusing only on scale weight could lead to the wrong interpretation of progress.`
      }
    ],
    rubric: `Criterion 1: Explains that lean mass retention during a calorie deficit depends primarily on the presence of a resistance training stimulus and adequate total protein intake. Criterion 2: Explains that protein distribution can further support retention and recovery, but is treated as a modifying factor rather than the sole or dominant explanation. Criterion 3: Predicts that the person who lifts weights is more likely to retain more lean mass or metabolically active tissue during the deficit. Criterion 4: Distinguishes total scale weight loss from body composition outcome, explaining that equal weight loss does not imply equal lean mass retention.`
  },
  {
    id: 7,
    title: 'Dietary Fat, Lipids, and Energy Regulation',
    rootQuestion: `A person believes eating fat directly causes body fat gain in a uniquely direct way, while carbohydrate and protein do not. Explain why this view is too simplistic, identify the difference between dietary fat as an incoming nutrient and body fat as stored energy tissue, and predict what actually determines whether net fat mass rises over time.`,
    branches: [
      {
        label: 'Edge Case',
        question: `A person eats a very high fat, very low carbohydrate diet and reaches a stable body weight without gaining fat despite high fat intake. Explain why this does not contradict the principles of fat metabolism, identify the energy balance variable that explains the outcome, and predict what would happen to body fat if fat intake increased further while total calories exceeded expenditure.`
      },
      {
        label: 'Cross-Root Integration',
        question: `Two diets contain equal calories, but one is very low fat and the other includes moderate fat from foods like eggs, olive oil, salmon, and nuts. Explain why the higher-fat diet is not automatically worse, identify at least two physiological roles of dietary fat besides energy provision, and predict what problem might emerge if fat intake is driven excessively low for long periods.`
      },
      {
        label: 'Counterintuitive Prediction',
        question: `A person improves diet quality, loses body fat, and exercises more, yet a standard lipid panel improves more than their body weight alone would predict. Explain why this is plausible, identify why blood lipids are about transport and metabolism rather than simply "fat eaten," and predict why metabolic context can matter as much as total fat intake.`
      }
    ],
    rubric: `Criterion 1: Explains that dietary fat intake alone does not determine whether body fat rises, because net fat mass change depends on total energy storage over time. Criterion 2: Clearly distinguishes dietary fat as an incoming nutrient from adipose tissue as stored body energy. Criterion 3: Predicts that body fat rises over time when energy intake persistently exceeds expenditure, regardless of whether the surplus comes mainly from fat, carbohydrate, or protein. Criterion 4: Rewards additional accurate explanation of other roles of dietary fat — such as support for membranes, hormone-related functions, or absorption of fat-soluble vitamins — but does not require those points for full credit on the root question alone.`
  },
  {
    id: 8,
    title: 'Fiber, Gut Function, and the Microbiome',
    rootQuestion: `A person eating a low-fiber, highly refined diet shifts toward legumes, oats, fruit, potatoes, yogurt, and vegetables, then temporarily experiences more gas and bloating despite improving overall diet quality. Explain why this does not automatically mean the new diet is harmful, identify the major gut-level process that is changing, and predict how the body may adapt if the shift is introduced more gradually and tolerated well.`,
    branches: [
      {
        label: 'Edge Case',
        question: `A person with IBS-like symptoms notices that some high-fiber foods worsen symptoms while others are tolerated well. Explain why "fiber is healthy" is still true in a broad sense but incomplete for this case, identify the variable that differs across fiber types and fermentability, and predict why personalized tolerance can matter more than broad health slogans.`
      },
      {
        label: 'Cross-Root Integration',
        question: `Two people eat the same calories, but one consumes mostly low-fiber refined foods while the other consumes higher-fiber whole foods. Explain how this can influence satiety, stool quality, and glycemic stability even before major body composition changes occur, and predict which person is more likely to feel fuller per calorie over time.`
      },
      {
        label: 'Counterintuitive Prediction',
        question: `A person improves digestion not by adding supplements first, but by regularizing meal timing, increasing fluids, walking more, and raising fiber carefully. Explain why this can work despite seeming too simple, identify the gut function variables being influenced, and predict why behavior and routine can change GI outcomes even before specialized interventions are needed.`
      }
    ],
    rubric: `Criterion 1: Explains that temporary bloating during fiber increase can reflect changing fermentation and gut adaptation rather than proof of harm. Criterion 2: Identifies fiber type, fermentability, motility, and individual tolerance as major variables. Criterion 3: Predicts that gradual introduction and consistent exposure often improve tolerance over time when the underlying pattern is beneficial. Criterion 4: Connects fiber and gut function to satiety and metabolic stability rather than treating digestion as an isolated system.`
  },
  {
    id: 9,
    title: 'Adaptive Metabolism and Diet Response Variability',
    rootQuestion: `A person begins a large calorie deficit, loses fat quickly at first, and then experiences a slowdown despite continued compliance. They conclude their metabolism is "broken." Explain why this interpretation is inaccurate, identify the components of energy expenditure and behavior that shift during prolonged dieting, and predict what happens to hunger, movement, and maintenance calories as the diet continues.`,
    branches: [
      {
        label: 'Edge Case',
        question: `Two people each lose the same amount of weight, but one used resistance training, high protein, and a slower pace while the other crash dieted rapidly with little training. Explain why their post-diet metabolic situation is unlikely to be identical, identify the structural tissue difference most likely involved, and predict which person is at greater risk of rebound weight gain.`
      },
      {
        label: 'Cross-Root Integration',
        question: `A person increases exercise to speed up fat loss, but scale change is smaller than expected because they also become more sedentary outside workouts and noticeably hungrier. Explain how this still fits energy balance, identify the compensatory response involved, and predict what hidden variable likely shrank the true deficit.`
      },
      {
        label: 'Counterintuitive Prediction',
        question: `A person takes a diet break at maintenance calories and later resumes dieting with better training performance, lower perceived fatigue, and improved adherence. Explain why this can sometimes help even though it temporarily slows scale loss, identify the variables it may restore or stabilize, and predict why short-term slowdown can improve long-term progress.`
      }
    ],
    rubric: `Criterion 1: Explains that fat-loss slowdown reflects a shrinking effective deficit, not a broken violation of energy balance. Criterion 2: Identifies lower body mass, reduced thermic effect, reduced NEAT, and adaptive thermogenesis as contributors. Criterion 3: Predicts rising hunger and lower spontaneous movement as common responses to dieting. Criterion 4: Connects tissue preservation, training, and diet pace to better long-term post-diet outcomes.`
  },
  {
    id: 10,
    title: 'Micronutrients, Deficiency Mechanisms, and Physiological Demand',
    rootQuestion: `A person says micronutrients only matter if deficiency becomes extreme enough to cause an obvious disease. Explain why this is too narrow, identify how vitamins and minerals function as physiological enablers rather than simple add-ons, and predict why restrictive diets can impair performance, recovery, and health before a classic severe deficiency syndrome appears.`,
    branches: [
      {
        label: 'Edge Case',
        question: `An athlete eating in a calorie surplus but with very low dietary variety develops signs of fatigue, impaired recovery, and poor immune function despite adequate calories and protein. Explain why caloric and protein sufficiency do not guarantee micronutrient sufficiency, identify the mechanism linking dietary diversity to micronutrient coverage, and predict which micronutrient gaps are most likely in a narrow high-calorie diet.`
      },
      {
        label: 'Cross-Root Integration',
        question: `Two people eat the same calories, but one eats a highly varied diet while the other relies on a very narrow menu of refined convenience foods. Explain why calorie sufficiency does not guarantee micronutrient sufficiency, identify the general risk created by low dietary diversity, and predict which person is more likely to develop subtle functional problems first.`
      },
      {
        label: 'Counterintuitive Prediction',
        question: `A person has adequate nutrient intake on paper but still develops signs of poor nutritional status because of a digestive or absorption problem. Explain why this is possible, identify the difference between intake and bioavailability, and predict why digestive function can matter as much as diet content itself in some cases.`
      }
    ],
    rubric: `Criterion 1: Explains that micronutrients support physiology continuously and do not matter only at the point of extreme deficiency disease. Criterion 2: Identifies the concept of vitamins and minerals as cofactors or functional enablers across energy production, repair, blood formation, nerve function, and other systems. Criterion 3: Predicts that restrictive or poorly absorbed diets can impair performance and function before dramatic textbook deficiency signs appear.`
  },
  {
    id: 11,
    title: 'Nutrition Strategy for Body Composition, Performance, and Adherence',
    rootQuestion: `A person wants a single "perfect diet" that can maximize fat loss, muscle gain, metabolic health, meal enjoyment, social flexibility, and long-term adherence all at once with no tradeoffs. Explain why this goal is unrealistic, identify the major variables that must be prioritized differently depending on the objective, and design the principle-level logic of a diet that fits the person's real goal rather than chasing an impossible ideal.`,
    branches: [
      {
        label: 'Fat Loss Scenario',
        question: `Design the principle-level structure of a fat-loss diet for someone who struggles with hunger and late-night overeating. Explain which variables deserve priority first, identify the foods or meal qualities most likely to help, and predict which mistake would make the plan fail even if the calorie target looks correct on paper.`
      },
      {
        label: 'Muscle Gain Scenario',
        question: `Design the principle-level structure of a muscle-gain diet for someone who trains hard but has low appetite and unintentionally under-eats. Explain which nutritional variables most need to increase, identify why total intake can become the limiting factor, and predict why a perfectly "clean" eating style might paradoxically slow muscle gain in this case.`
      },
      {
        label: 'Long-Term Adherence Scenario',
        question: `A person can follow very strict diets for two weeks but then rebounds hard. Explain why the problem is not just discipline, identify which design variables need to change to improve adherence, and predict why a slightly less aggressive but more repeatable plan often wins over a theoretically faster one.`
      },
      {
        label: 'Performance Fueling Scenario',
        question: `A person trains hard five days per week, is not trying to lose weight aggressively, but feels flat in workouts, recovers poorly, and often under-eats earlier in the day. Design the principle-level structure of a nutrition approach for performance and recovery, explain which variables deserve priority first, identify why carbohydrate and total energy availability matter here, and predict what problem occurs if the person tries to eat too "clean" and too little while maintaining high training output.`
      },
      {
        label: 'Maintenance Scenario',
        question: `A person has successfully lost weight and now wants to maintain results without returning to constant dieting. Design the principle-level structure of a maintenance diet, explain which variables should now become the priority, identify why maintenance requires different skills than active fat loss, and predict what mistake is most likely to cause rebound even if the person understands calories in theory.`
      }
    ],
    rubric: `Criterion 1: Explains that no single diet can maximize fat loss, muscle gain, metabolic health, enjoyment, flexibility, and adherence simultaneously because meaningful nutritional tradeoffs exist. Criterion 2: Identifies that diet design must prioritize variables differently depending on the person's main goal, such as satiety and adherence for fat loss, total intake and protein sufficiency for muscle gain, or fuel support and recovery for performance. Criterion 3: Designs a principle-level strategy that is coherent, goal-matched, and physiologically defensible rather than relying on fad rules or vague preferences. Criterion 4: Distinguishes among fat-loss, muscle-gain, performance, and maintenance contexts rather than treating all nutritional goals as requiring the same structure, and allows more than one full-credit answer provided the learner clearly states the primary goal, identifies the relevant tradeoffs, and builds a repeatable diet structure aligned with that goal.`
  }
];


export const DICTIONARY = {
  1: [
    {
      term: 'Energy balance',
      definition: 'The relationship between energy intake and energy expenditure that determines whether body mass tends to rise, fall, or remain stable over time.',
      why: 'It is the governing principle behind all body weight change — the reason the person in the root question continues gaining weight despite eating "healthy" food.',
      excellent_standard: 'An Excellent answer defines energy balance as the intake-to-expenditure relationship, explains that a positive balance (intake exceeds expenditure) produces net tissue gain regardless of food quality, and predicts that body mass will continue rising as long as the surplus persists — even if the source of that surplus is nutritious whole food. It identifies food quality as influencing satiety, health, and adherence but not as a substitute for the energy balance mechanism itself.'
    },
    {
      term: 'Energy expenditure',
      definition: 'The total amount of energy the body uses through basal processes, physical activity, digestion, and other physiological work.',
      why: 'Understanding its components explains why body weight does not always change predictably — expenditure is dynamic, not fixed, and shifts in response to diet and activity.',
      excellent_standard: 'An Excellent answer identifies the major components of energy expenditure — basal metabolic rate, thermic effect of food, and activity thermogenesis including NEAT — and explains that expenditure is not constant but adapts in response to body size, diet, and training. It connects this to the root question by explaining that weight gain is not proof calories do not matter; it is proof intake exceeded this total expenditure over time.'
    },
    {
      term: 'Maintenance intake',
      definition: 'The approximate energy intake at which body weight is stable because average intake matches average expenditure.',
      why: 'It is the reference point for understanding whether a person is in surplus or deficit — and why someone eating "healthy" can still be above maintenance.',
      excellent_standard: 'An Excellent answer explains that maintenance intake is not a fixed number but a range that shifts with body size, composition, and activity level. It predicts that if food quality improves but total intake remains above maintenance, body weight will continue rising — and that if food quality worsens but intake falls below maintenance, body weight will decline. Maintenance is determined by energy, not food virtue.'
    },
    {
      term: 'Calorie deficit',
      definition: 'A state in which average energy intake is lower than energy expenditure, pushing the body toward net tissue loss over time.',
      why: 'It is the necessary condition for fat loss — the mechanism that causes scale weight to decrease despite the early water and glycogen changes that complicate interpretation.',
      excellent_standard: 'An Excellent answer defines a calorie deficit as sustained average intake below expenditure and explains that short-term scale fluctuations — especially rapid early loss — do not reflect the steady deficit-driven fat loss process. It predicts that once glycogen and water shifts stabilize, scale movement reflects net tissue loss driven by the deficit, and connects this to why week-one results are not representative of the ongoing mechanism.'
    },
    {
      term: 'Calorie surplus',
      definition: 'A state in which average energy intake exceeds energy expenditure, pushing the body toward net tissue gain over time.',
      why: 'It is the direct mechanistic cause of the weight gain in the root question — regardless of whether the excess calories come from high-quality food.',
      excellent_standard: 'An Excellent answer defines surplus as the intake-exceeds-expenditure condition and explains that tissue gain — primarily fat and some lean mass depending on context — is the predictable consequence. It addresses the root question directly: the person gaining weight despite eating well is in a sustained surplus, and improving food quality alone cannot reverse that unless intake falls toward or below expenditure.'
    },
    {
      term: 'Body composition',
      definition: 'The relative proportions of fat mass and fat-free mass that make up body weight.',
      why: 'It is the reason scale weight alone is an incomplete indicator of progress — two people at the same weight can have very different physiological and visual outcomes depending on their fat-to-lean ratio.',
      excellent_standard: 'An Excellent answer distinguishes body weight as a single number from body composition as a ratio of fat mass to fat-free mass, and explains that scale changes can reflect shifts in fat, muscle, water, or glycogen simultaneously. It predicts that a person near maintenance who starts resistance training may see little scale change while meaningfully improving body composition — and connects this to the counterintuitive prediction branch where the mirror improves despite stable weight.'
    },
    {
      term: 'Scale fluctuation',
      definition: 'Short-term changes in body weight driven by variables such as water balance, glycogen status, digestive contents, and sodium intake rather than true changes in body fat.',
      why: 'It explains why daily body weight can rise or fall even when underlying energy balance and fat-loss direction remain unchanged.',
      excellent_standard: 'An Excellent answer defines scale fluctuation as short-term body weight noise driven by non-fat variables, distinguishes it from true tissue change, and explains that energy balance governs long-term tissue trends while daily scale movement often reflects hydration, glycogen, digestive contents, and similar transient factors. It predicts that a consistent downward trend over weeks is the meaningful signal, and that individual daily increases during a deficit do not indicate fat regain.'
    }
  ],
  2: [
    {
      term: 'Macronutrient',
      definition: 'A major dietary nutrient category required in relatively large amounts, primarily protein, carbohydrate, and fat.',
      why: 'Understanding that macronutrients are not interchangeable physiologically is the foundation of the root question — the statement that they are equivalent as long as calories match is exactly the incomplete claim being challenged.',
      excellent_standard: 'An Excellent answer defines macronutrients as the three primary energy-containing nutrient classes and immediately distinguishes caloric equivalence from functional equivalence. It explains that while all three contribute calories, their distinct structures produce different physiological effects — structural repair, glycogen storage, membrane function — that cannot be substituted across macronutrients simply by matching energy content.'
    },
    {
      term: 'Protein',
      definition: 'A macronutrient made of amino acids that primarily supports structure, repair, enzymes, signaling, and many other functional roles.',
      why: 'It is the macronutrient most directly linked to lean mass retention, recovery, and satiety — and the one whose reduction first produces visible functional consequences when calories are held equal.',
      excellent_standard: 'An Excellent answer defines protein by its amino acid composition and explains the causal chain: when protein intake falls below what supports continuous protein turnover, the body increasingly breaks down existing tissue to meet functional amino acid demands. It predicts that the first visible consequences of low protein are reduced satiety, impaired recovery, and lean mass loss — not immediate scale weight change — because protein\'s role in structure and repair is continuous and cannot be met by carbohydrate or fat regardless of caloric equivalence.'
    },
    {
      term: 'Carbohydrate',
      definition: 'A macronutrient broken down largely into glucose and used prominently for rapid energy supply and glycogen storage.',
      why: 'Its most important practical feature — glycogen storage — explains the rapid weight changes that confuse people during high-carbohydrate periods or training blocks.',
      excellent_standard: 'An Excellent answer defines carbohydrate as a glucose-yielding macronutrient and explains the glycogen storage mechanism: each gram of glycogen is stored with approximately 3 grams of water, so rapid glycogen loading during a training block or dietary increase can add several pounds of scale weight in days without adding meaningful fat. It predicts that weight gained rapidly when carbohydrates increase reflects glycogen and associated water — and that this weight will drop again rapidly when carbohydrates are reduced or training stops, with no change in actual fat mass.'
    },
    {
      term: 'Dietary fat',
      definition: 'A macronutrient that provides energy, supports membranes and hormones, and aids absorption of fat-soluble vitamins.',
      why: 'Its non-energy roles explain why excessively low fat intake creates problems even when calories are adequate — the person in the counterintuitive branch develops issues not from caloric insufficiency but from loss of fat\'s structural and absorptive functions.',
      excellent_standard: 'An Excellent answer defines dietary fat as the most energy-dense macronutrient and identifies its non-energy functions: cell membrane integrity, steroid hormone precursor supply, and fat-soluble vitamin absorption. It explains that when fat intake drops too low, these functional roles fail progressively — hormone disruption typically appears before extreme deficiency because steroid synthesis requires continuous fat substrate. It predicts that vitamins A, D, E, and K become increasingly unavailable even when dietary intake is present, because fat is required for their absorption from the gut.'
    },
    {
      term: 'Glycogen',
      definition: 'The stored form of carbohydrate found mainly in liver and muscle tissue.',
      why: 'It is the specific mechanism that causes rapid multi-pound weight changes during carbohydrate loading or restriction — and the reason such changes do not represent fat gain or loss.',
      excellent_standard: 'An Excellent answer defines glycogen as the polymerized glucose storage molecule in muscle and liver, explains that its hydration state (approximately 3g water per gram of glycogen) means loading or depleting it rapidly shifts scale weight by 2 to 5 pounds without any change in fat mass. It predicts that a person beginning a training block with increased carbohydrate will gain weight rapidly on the scale, lose it rapidly if they reduce carbohydrates or stop training, and that neither change reflects actual changes in body fat — making glycogen dynamics a critical concept for interpreting scale weight accurately.'
    }
  ],
  3: [
    {
      term: 'Digestion',
      definition: 'The mechanical and chemical breakdown of food into smaller components that can be absorbed.',
      why: 'It is the upstream process that determines what nutrients become available — and its rate and completeness depend on food form, eating speed, and digestive enzyme function.',
      excellent_standard: 'An Excellent answer defines digestion as mechanical and chemical reduction of food to absorbable units — glucose, amino acids, fatty acids — and explains that digestion rate and completeness are influenced by food structure, eating speed, and enzyme availability. It connects this to the root question by explaining that the two people digest the meal identically at this stage, but that absorbed nutrients enter a very different physiological context depending on training state and tissue demand.'
    },
    {
      term: 'Absorption',
      definition: 'The movement of digested nutrients from the gastrointestinal tract into the body.',
      why: 'It is the step where nutrients become available to tissues — and where impaired function, as in the enzyme-deficiency edge case, causes nutrients to pass through unused despite adequate intake.',
      excellent_standard: 'An Excellent answer defines absorption as nutrient transfer across the intestinal wall into the bloodstream or lymphatics and explains that absorbed nutrients are then distributed to tissues according to demand rather than uniformly. It predicts that the post-exercise person absorbs the same nutrients but routes incoming glucose preferentially to depleted glycogen stores in muscle, while the sedentary fasted person routes glucose primarily to liver glycogen and, if surplus persists, to fat storage — demonstrating that absorption is the same but nutrient fate differs.'
    },
    {
      term: 'Pancreatic enzymes',
      definition: 'Digestive enzymes released by the pancreas that help break down protein, fat, and carbohydrate.',
      why: 'Their failure in the edge case explains the specific symptom pattern — steatorrhea, bloating, and progressive fat-soluble vitamin deficit — that cannot be attributed to diet alone.',
      excellent_standard: 'An Excellent answer defines pancreatic enzymes as lipase, protease, and amylase and explains that lipase is the critical enzyme for fat digestion — without it, triglycerides pass through the gut largely intact, emerging as greasy stool. It predicts that chronic fat malabsorption progressively depletes fat-soluble vitamins A, D, E, and K because these vitamins require fat digestion and micelle formation for absorption — making lipase insufficiency a systemic nutritional risk beyond just GI symptoms.'
    },
    {
      term: 'Malabsorption',
      definition: 'Reduced ability to properly absorb nutrients from the digestive tract.',
      why: 'It is the underlying problem in the enzyme-deficiency edge case and explains why adequate dietary intake does not guarantee adequate nutritional status.',
      excellent_standard: 'An Excellent answer defines malabsorption as a failure of nutrient transfer from gut to body and explains that it can occur at multiple points — insufficient enzyme activity, damaged intestinal surface, impaired transport — each producing distinct patterns. It identifies steatorrhea as the hallmark of fat malabsorption specifically and predicts that fat-soluble vitamin deficiency will emerge gradually and silently, often before severe GI symptoms, because the deficiency accumulates across weeks rather than appearing acutely.'
    }
  ],
  4: [
    {
      term: 'Satiety',
      definition: 'The lasting sense of fullness that reduces the desire to keep eating after a meal.',
      why: 'It is the central variable in the root question — the person failing diets is not lacking knowledge but lacking satiety, which eventually overrides intention.',
      excellent_standard: 'An Excellent answer defines satiety as the sustained suppression of hunger after a meal and explains the causal chain: when satiety is low per calorie consumed, hunger returns before the next eating opportunity, creating persistent pressure to eat more. It predicts that a diet theoretically adequate in calories but low in satiety-supporting properties will consistently generate hunger-driven deviation, making adherence failure a predictable physiological outcome rather than a willpower failure.'
    },
    {
      term: 'Palatability',
      definition: 'How rewarding, tasty, and easy a food is to continue eating.',
      why: 'It is the mechanism behind the binge in the root question — highly palatable foods can override satiety signals, allowing continued eating well past energy need.',
      excellent_standard: 'An Excellent answer defines palatability as the reward-driven motivation to keep eating beyond hunger satisfaction and explains the conflict it creates with satiety: highly palatable foods often have high energy density and low fiber, meaning they produce calories faster than fullness signals can develop. It predicts that removing highly palatable foods entirely often increases their psychological salience and binge risk, while strategic inclusion in a high-satiety framework tends to produce better behavioral stability.'
    },
    {
      term: 'Adherence',
      definition: 'The ability to consistently follow a nutritional approach over time.',
      why: 'It is the variable that determines whether any diet actually works in the real world — a perfect diet on paper produces zero outcome if it cannot be followed.',
      excellent_standard: 'An Excellent answer defines adherence as consistency of behavior over time and identifies it as a primary determinant of dietary outcomes — more important in many cases than the specific macronutrient ratio or food quality level of the plan. It explains that adherence fails predictably when satiety is too low, restriction is too aggressive, or the diet is incompatible with the person\'s lifestyle and preferences. It predicts that a moderately aggressive diet with high adherence almost always outperforms a maximally aggressive diet with poor adherence over any timeframe beyond a few weeks.'
    },
    {
      term: 'Energy density',
      definition: 'The number of calories contained in a given weight or volume of food.',
      why: 'It is the property that most directly determines how many calories a person consumes before reaching physical fullness — lower energy density means more food volume per calorie, which supports satiety.',
      excellent_standard: 'An Excellent answer defines energy density as calories per gram or per unit volume and explains the causal mechanism: the stomach responds to volume and stretch, not caloric content, so eating low-energy-density foods generates fullness signals from the same or greater volume of food while delivering fewer calories. It predicts that shifting toward lower energy density foods — vegetables, fruits, lean proteins, legumes — allows a person to eat satisfying amounts of food within a calorie target, while high energy density eating requires very small portions to stay within the same target, generating persistent hunger.'
    },
    {
      term: 'Food volume',
      definition: 'The physical amount of food consumed, which can affect fullness independently of calorie count.',
      why: 'It helps explain why low-energy-density eating is often easier to sustain, since larger food volume can produce fullness at a lower calorie intake.',
      excellent_standard: 'An Excellent answer defines food volume as the physical bulk of food consumed and explains that higher-volume foods often produce more gastric distension and fullness for fewer calories than compact, energy-dense foods. It connects this to satiety by explaining why a person may feel more satisfied on a diet built around higher-volume foods even when total calories are lower — and predicts that replacing liquid or low-volume calorie sources with higher-volume whole foods is one of the most practical tools for reducing hunger within a deficit.'
    }
  ],
  5: [
    {
      term: 'Insulin sensitivity',
      definition: 'How effectively cells respond to insulin\'s signal to take up and manage nutrients, especially glucose.',
      why: 'It is the primary variable explaining why Person A and Person B have different glucose responses to the same meal despite eating identically.',
      excellent_standard: 'An Excellent answer defines insulin sensitivity as the magnitude of cellular response per unit of insulin signal and explains the consequence of reduced sensitivity: more insulin is required to achieve the same glucose uptake, so Person A with insulin resistance requires a larger hormonal response to normalize the same carbohydrate load. It predicts that chronic insulin resistance progressively elevates post-meal glucose and insulin, increasing fat storage drive and reducing glycogen resynthesis efficiency in muscle — and that sleep deprivation directly and acutely worsens insulin sensitivity even in otherwise healthy individuals.'
    },
    {
      term: 'Glycemic control',
      definition: 'The regulation of blood glucose within a healthy range across fasting and fed states.',
      why: 'It is the outcome being compared between the two people in the root question — the same meal produces very different glycemic control depending on physiological state.',
      excellent_standard: 'An Excellent answer defines glycemic control as the dynamic regulation of blood glucose across feeding and fasting cycles and explains that effective control depends on multiple factors operating simultaneously: insulin secretion, tissue sensitivity, glycogen availability, hepatic glucose regulation, and activity level. It identifies the recently trained, well-rested person as having meaningfully better glycemic control not because of a single variable but because multiple systems are simultaneously operating in a more favorable state — and predicts that impaired glycemic control accumulates risk for metabolic disease not through single large events but through chronic low-grade dysregulation.'
    },
    {
      term: 'GLUT4',
      definition: 'A glucose transporter prominently involved in moving glucose into muscle and some other tissues in response to insulin or muscle contraction.',
      why: 'It is the specific mechanism behind the post-exercise glucose clearance advantage — GLUT4 translocation is enhanced by recent muscle contraction independently of insulin.',
      excellent_standard: 'An Excellent answer defines GLUT4 as an insulin-sensitive glucose transporter that translocates to the cell surface in response to both insulin signaling and muscle contraction, and explains the critical dual activation: exercise depletes glycogen and activates AMPK, which independently drives GLUT4 to the surface without requiring insulin. This means the recently trained person has enhanced glucose clearance from two simultaneous mechanisms — insulin signaling and contraction-driven translocation — while the sedentary, insulin-resistant person relies only on a blunted insulin signal. It predicts that post-meal walking improves glucose disposal through the contraction pathway independently of body weight change.'
    },
    {
      term: 'Hepatic glucose output',
      definition: 'The release of glucose by the liver into the bloodstream, especially during fasting.',
      why: 'It explains why a person eating very low carbohydrate can still show elevated fasting glucose without worsening disease — the liver releases glucose to maintain blood levels during prolonged restriction.',
      excellent_standard: 'An Excellent answer defines hepatic glucose output as the liver\'s continuous release of glucose from glycogenolysis and gluconeogenesis during fasting and explains that on a very low carbohydrate diet, the liver increases gluconeogenesis to maintain blood glucose. It predicts that mildly elevated fasting glucose in this context reflects adaptive glucose sparing — the liver is sustaining brain glucose supply rather than indicating insulin resistance progression — and identifies fasting insulin or an insulin sensitivity measure as the distinguishing marker, since adaptive glucose elevation occurs with low or normal insulin while pathological insulin resistance occurs with high fasting insulin alongside elevated glucose.'
    },
    {
      term: 'Postprandial glucose',
      definition: 'Blood glucose levels after a meal.',
      why: 'It is the key measurable outcome in this root and helps distinguish meal-response physiology from fasting markers.',
      excellent_standard: 'An Excellent answer defines postprandial glucose as blood glucose after eating, explains that it reflects the interaction of meal composition, insulin sensitivity, tissue demand, and post-meal activity, and predicts that it often improves before fasting measures when lifestyle changes such as walking after meals are introduced — because post-meal glucose disposal is the first thing improved by contraction-driven GLUT4 activation, while fasting glucose is regulated by hepatic mechanisms that change more slowly.'
    }
  ],
  6: [
    {
      term: 'Protein turnover',
      definition: 'The continuous process of protein breakdown and rebuilding throughout the body.',
      why: 'It explains why protein must be consumed regularly and in distributed doses — the body is continuously breaking down and rebuilding tissue, and the net balance of this process determines whether lean mass is retained or lost.',
      excellent_standard: 'An Excellent answer defines protein turnover as the simultaneous and continuous cycling of protein breakdown and synthesis throughout all tissues and explains that net muscle retention depends on whether synthesis exceeds breakdown over time. It connects this to the root question by explaining that Person B eating protein in one large bolus may stimulate one large synthesis pulse but then leaves protein turnover without adequate substrate for the remaining hours, while Person A\'s distributed intake maintains repeated synthesis pulses across the day — producing greater net protein retention despite identical total intake.'
    },
    {
      term: 'Lean mass',
      definition: 'The non-fat portion of the body, including muscle, organs, bone, water, and other fat-free tissues.',
      why: 'It is the tissue most relevant to metabolic rate, physical performance, and long-term body composition — and the tissue that differs most between Person A and Person B despite identical scale weight loss.',
      excellent_standard: 'An Excellent answer defines lean mass as total body weight minus fat mass and explains that it is metabolically active tissue determining basal energy expenditure and physical capacity. It predicts that Person A retains more lean mass because training provides an anabolic signal directing protein toward muscle repair, while Person B in a deficit with no training signal experiences lean mass loss alongside fat loss. It addresses the scale weight equivalence paradox: identical total weight loss can conceal dramatically different body composition outcomes — Person A loses more fat relative to lean, Person B loses more lean relative to fat.'
    },
    {
      term: 'Muscle protein synthesis',
      definition: 'The process by which the body builds new muscle proteins from available amino acids.',
      why: 'It is the specific anabolic process that training stimulates and that distributed protein intake supports — and its rate relative to breakdown determines whether muscle is built, maintained, or lost.',
      excellent_standard: 'An Excellent answer defines muscle protein synthesis as ribosomal assembly of new muscle proteins from amino acid substrates and explains the rate-limiting role of leucine threshold in triggering the mTORC1 signaling cascade. It explains that synthesis is a pulsatile process — each meal with adequate leucine stimulates a discrete synthesis pulse lasting several hours — and predicts that distributing protein across multiple meals generates more total synthesis pulses per day than concentrating it in one meal, explaining why Person A retains more lean mass despite the same total intake.'
    },
    {
      term: 'Nitrogen balance',
      definition: 'The relationship between nitrogen intake and nitrogen loss, often used as a rough proxy for whole-body protein status.',
      why: 'It is the whole-body indicator of whether protein intake is sufficient to cover turnover demands — and the tool that reveals when lean mass is being lost even when scale weight changes appear acceptable.',
      excellent_standard: 'An Excellent answer defines nitrogen balance as the difference between dietary nitrogen intake and urinary, fecal, and other nitrogen losses, and explains that negative nitrogen balance — more nitrogen excreted than consumed — indicates net protein catabolism across the body. It predicts that Person B in a deficit with concentrated protein intake and no training is more likely to be in negative or neutral nitrogen balance because protein distribution and anabolic signaling are both suboptimal, while Person A\'s training and distributed intake support positive or neutral balance even during fat loss — explaining how identical scale weight loss can produce very different nitrogen balance trajectories.'
    }
  ],
  7: [
    {
      term: 'Adipose tissue',
      definition: 'Body tissue specialized for storing energy, cushioning structures, and producing signaling molecules.',
      why: 'It is the actual site of body fat storage — and distinguishing it from dietary fat as a nutrient is the core conceptual correction the root question demands.',
      excellent_standard: 'An Excellent answer defines adipose tissue as the body\'s primary long-term energy storage depot and explains that it stores fat derived from any macronutrient in surplus — not exclusively dietary fat. It addresses the root question misconception directly: adipose tissue grows when any caloric surplus exists, regardless of whether that surplus comes from fat, carbohydrate, or protein, because all three can be converted to triglycerides for storage when energy intake exceeds expenditure. The causal driver of fat mass increase is sustained positive energy balance, not the fat content of the diet.'
    },
    {
      term: 'Lipoprotein',
      definition: 'A particle that transports fats and cholesterol through the blood.',
      why: 'It explains why blood lipid levels do not simply reflect dietary fat intake — lipoprotein production and clearance depend on metabolic context, not just what was eaten.',
      excellent_standard: 'An Excellent answer defines lipoproteins as transport particles — notably LDL, HDL, and VLDL — and explains that blood lipid levels reflect lipoprotein metabolism, not dietary fat consumption alone. It identifies that VLDL production is driven largely by liver fat accumulation from excess carbohydrate in the context of insulin resistance, not simply from eating fat, and predicts that metabolic improvements from exercise and caloric correction can improve lipid panels substantially even without dramatic changes in dietary fat intake — explaining the counterintuitive prediction branch.'
    },
    {
      term: 'Triglyceride',
      definition: 'A common form of fat used for energy storage in food and in the body.',
      why: 'It is the storage form of fat in both adipose tissue and blood — and understanding that triglycerides in blood can be elevated by carbohydrate and caloric excess, not just dietary fat, dismantles the simplistic view in the root question.',
      excellent_standard: 'An Excellent answer defines triglycerides as three fatty acids esterified to glycerol and explains their dual role: as dietary fat in food and as the primary storage form in adipose tissue. It explains that blood triglycerides are elevated not primarily by eating fat but by excess carbohydrate intake and insulin resistance driving hepatic VLDL production — making elevated triglycerides a carbohydrate and metabolic health marker as much as a fat intake marker. It predicts that a person eating moderate fat but excess refined carbohydrate may have worse triglyceride levels than someone eating more fat within a well-controlled caloric intake.'
    },
    {
      term: 'Fat-soluble vitamins',
      definition: 'Vitamins A, D, E, and K, which are absorbed along with dietary fat.',
      why: 'They are the specific micronutrients at risk when dietary fat is driven too low — their absorption requires fat in the gut, making fat intake a prerequisite for micronutrient sufficiency even when the diet appears vitamin-rich.',
      excellent_standard: 'An Excellent answer defines fat-soluble vitamins as vitamins A, D, E, and K and explains the causal absorption mechanism: these vitamins require dietary fat to form micelles in the gut for absorption — without fat present, they pass through the digestive tract largely unused even if they are present in food. It predicts that chronically very low fat intake impairs fat-soluble vitamin status progressively, with vitamin D and A deficiency being among the first functional consequences, and connects this to the cross-root integration branch where excessive fat restriction creates hormonal and micronutrient problems despite adequate caloric intake.'
    }
  ],
  8: [
    {
      term: 'Fiber',
      definition: 'A class of indigestible or partially digestible carbohydrate components that influence gut function, stool quality, fermentation, and satiety.',
      why: 'It is the central variable in the root question — the person\'s GI symptoms arise from changing the fermentation environment faster than the gut microbiome can adapt.',
      excellent_standard: 'An Excellent answer defines fiber as a structurally diverse class of plant carbohydrates resistant to small intestinal digestion and explains the distinction between soluble and insoluble fiber: soluble fiber is fermented by gut bacteria, producing gas and short-chain fatty acids, while insoluble fiber adds bulk and accelerates transit. It explains that the symptoms in the root question arise because the existing microbiome is not yet equipped to ferment the new fiber load without excess gas production — a sign of ecological change, not harm — and predicts that gradual introduction allows microbial populations to shift toward better fiber-fermenting capacity, improving tolerance over weeks.'
    },
    {
      term: 'Fermentation',
      definition: 'The breakdown of certain food components by gut microbes, producing gases and metabolites such as short-chain fatty acids.',
      why: 'It is the specific mechanism causing the temporary bloating and gas — fermentation of newly introduced fiber by gut bacteria produces gas as a byproduct of producing beneficial metabolites.',
      excellent_standard: 'An Excellent answer defines fermentation as microbial metabolism of fiber substrates in the large intestine and explains that the gases produced — hydrogen, carbon dioxide, and sometimes methane — are normal byproducts of healthy fermentation. It explains that excessive initial gas reflects a mismatch between substrate load and microbial capacity, not an indication that the foods are harmful. It predicts that as the microbiome shifts toward higher populations of efficient fiber-fermenting species, gas production per gram of fiber decreases and short-chain fatty acid production increases — improving both GI comfort and metabolic benefits simultaneously.'
    },
    {
      term: 'Microbiome',
      definition: 'The community of microorganisms living in and on the body, especially the gut.',
      why: 'It is the dynamic ecosystem whose composition determines how fiber is processed — and whose gradual adaptation explains why GI symptoms improve with patient dietary change.',
      excellent_standard: 'An Excellent answer defines the gut microbiome as the diverse microbial community in the large intestine and explains that its composition shifts in response to diet over days to weeks. It explains that the low-fiber refined diet selects for a microbiome poorly adapted to fermenting complex plant carbohydrates, making the initial transition symptomatic. It predicts that consistent higher-fiber intake over several weeks shifts species composition toward more fiber-adapted populations — reducing gas production, increasing short-chain fatty acid output, and improving satiety and metabolic signaling — demonstrating that GI adaptation is a process, not a fixed state.'
    },
    {
      term: 'Motility',
      definition: 'The movement of food and waste through the digestive tract.',
      why: 'It is one of the gut variables most directly influenced by behavioral changes — meal timing, hydration, and physical activity — explaining why simple routine changes can improve digestion before supplements are needed.',
      excellent_standard: 'An Excellent answer defines motility as the coordinated muscular movement propelling gut contents through the digestive tract and explains that it is regulated by the enteric nervous system, circadian signals, hydration status, and physical activity. It explains that regularizing meal timing synchronizes motility with circadian rhythms, that adequate hydration softens stool and facilitates transit, and that walking stimulates bowel motility directly through physical activity. It predicts that these behavioral changes can meaningfully improve stool quality, regularity, and GI comfort before any specific dietary intervention or supplement is required — because the fundamental drivers of motility are behavioral and physiological, not exclusively nutritional.'
    },
    {
      term: 'Short-chain fatty acids',
      definition: 'Compounds produced largely through microbial fermentation of certain fibers, with effects on gut and metabolic function.',
      why: 'They are the beneficial end product of the fermentation process causing temporary discomfort — understanding them reframes initial symptoms as evidence of a productive gut process rather than harm.',
      excellent_standard: 'An Excellent answer defines short-chain fatty acids — primarily acetate, propionate, and butyrate — as fermentation metabolites produced by gut bacteria from fiber and explains their functional importance: butyrate is the primary fuel for colonocytes, propionate influences hepatic glucose metabolism, and both contribute to gut barrier integrity and anti-inflammatory signaling. It predicts that as adaptation progresses and gas production normalizes, short-chain fatty acid output increases — making the initial discomfort a transitional cost of moving toward a more metabolically favorable gut environment rather than a sign that fiber is not being tolerated.'
    }
  ],
  9: [
    {
      term: 'Adaptive thermogenesis',
      definition: 'A reduction in energy expenditure beyond what would be expected from body-size change alone, often occurring during prolonged energy restriction.',
      why: 'It is the metabolic mechanism that makes the person\'s "broken metabolism" interpretation partially correct in feeling but mechanistically wrong — expenditure does genuinely decrease, but this is adaptation, not damage.',
      excellent_standard: 'An Excellent answer defines adaptive thermogenesis as a metabolically suppressed state beyond what body mass loss predicts and explains the causal mechanism: prolonged energy restriction reduces thyroid hormone activity, leptin signaling, and sympathetic nervous system tone, all of which lower the resting metabolic rate and thermogenic responses. It predicts that adaptive thermogenesis means the original calorie deficit progressively shrinks even with consistent intake — a compliant dieter at the same calories is eating closer to their new maintenance each week — and connects this to the root question by explaining that the metabolism is not broken but has adapted defensively, making the same deficit insufficient over time.'
    },
    {
      term: 'NEAT',
      definition: 'Non-exercise activity thermogenesis; energy spent through spontaneous and routine movement outside formal exercise.',
      why: 'It is the most variable and most easily suppressed component of energy expenditure during dieting — the hidden variable that shrinks the true deficit even when formal food intake and exercise appear unchanged.',
      excellent_standard: 'An Excellent answer defines NEAT as the energy cost of all physical activity outside structured exercise — fidgeting, walking, posture, daily tasks — and explains that it is highly responsive to energy availability. During dieting, NEAT falls substantially and often unconsciously, reducing daily energy expenditure by 200 to 500 or more calories per day without the person noticing deliberate behavioral change. It predicts that a person increasing structured exercise while dieting may have their total daily energy expenditure remain nearly flat because NEAT decreases to compensate — explaining the cross-root integration branch where expected fat loss is less than calculated from exercise alone.'
    },
    {
      term: 'Metabolic adaptation',
      definition: 'The coordinated physiological and behavioral changes that alter energy expenditure and appetite in response to underfeeding or overfeeding.',
      why: 'It is the umbrella explanation for why the body does not respond to deficits or surpluses in a perfectly linear way — multiple systems adjust simultaneously to resist the imposed energy imbalance.',
      excellent_standard: 'An Excellent answer defines metabolic adaptation as a coordinated multi-system response to energy imbalance and identifies its major components: reduced resting metabolic rate, reduced NEAT, increased hunger and appetite signaling, and reduced thermogenic responses. It explains that adaptation is not a single event but a progressive process — the larger and longer the deficit, the more pronounced the adaptive response — and predicts that a diet break at maintenance temporarily reverses some adaptive components, including partial restoration of leptin, thyroid function, and NEAT, which is why the person in the counterintuitive branch resumes dieting with improved performance and adherence despite no scale loss during the break.'
    }
  ],
  10: [
    {
      term: 'Micronutrient',
      definition: 'A vitamin or mineral required in relatively small amounts but essential for normal physiology.',
      why: 'Framing micronutrients as small-dose but physiologically essential establishes the conceptual foundation for the root question — "small amounts" does not mean "optional."',
      excellent_standard: 'An Excellent answer defines micronutrients as vitamins and minerals required in milligram or microgram quantities and distinguishes this from macronutrients by quantity needed, not by importance. It explains that micronutrient requirements are non-negotiable because many serve as cofactors or structural components in processes with no alternative pathway — the body cannot substitute a missing cofactor with something else. It predicts that sub-clinical insufficiency degrades these processes before any dramatic disease appears, producing performance, recovery, and immune effects that are real but subtle and easily misattributed to other causes.'
    },
    {
      term: 'Deficiency',
      definition: 'A state in which a nutrient is insufficient to support normal physiological function.',
      why: 'Understanding that deficiency exists on a spectrum — not just as extreme clinical disease — dismantles the view that micronutrients only matter once obvious symptoms appear.',
      excellent_standard: 'An Excellent answer defines deficiency as insufficient nutrient status to support normal function and explains the spectrum: from frank deficiency causing severe disease to marginal deficiency causing subtle impairment to insufficiency causing no obvious symptoms but reduced physiological reserve. It explains that most people with nutritional shortfalls are in the marginal-to-insufficient range — impaired without knowing it — and that this range produces real consequences in energy production, immune function, collagen synthesis, and other continuous processes. It predicts that athletes and people under high physiological demand are most likely to experience functional consequences at marginal status levels because demand amplifies the impact of sub-optimal supply.'
    },
    {
      term: 'Bioavailability',
      definition: 'The proportion of a nutrient that can actually be absorbed and used by the body.',
      why: 'It explains how a person can have adequate dietary intake of a nutrient on paper and still develop deficiency — intake is not the same as what the body actually receives and uses.',
      excellent_standard: 'An Excellent answer defines bioavailability as the fraction of an ingested nutrient that is absorbed, transported, and available for metabolic use and explains that it differs dramatically across food forms, co-consumed nutrients, and digestive health. It identifies specific factors reducing bioavailability: phytates in grains and legumes binding minerals, fat-soluble vitamins requiring dietary fat for absorption, and damaged intestinal surfaces reducing absorption surface area. It predicts that a person with compromised gut function — whether from inflammation, enzyme insufficiency, or altered motility — can develop functional micronutrient deficits despite eating a nutritionally complete diet, making digestive function as critical as dietary content in determining nutritional status.'
    },
    {
      term: 'Cofactor',
      definition: 'A helper molecule, often a vitamin or mineral, required for certain enzymes or physiological reactions to function properly.',
      why: 'It is the specific mechanism through which micronutrients enable physiology — not as vague health additives but as required molecular participants in defined biochemical reactions.',
      excellent_standard: 'An Excellent answer defines a cofactor as a non-protein molecule required for enzyme activity and explains the causal consequence of cofactor insufficiency: the enzyme either cannot function or functions at reduced capacity, creating a specific bottleneck in whatever pathway it supports. It gives examples — magnesium as a cofactor in over 300 enzymatic reactions including ATP synthesis, vitamin B12 as a cofactor in myelin maintenance and DNA synthesis — and explains that these are not optional enhancements but biochemical requirements. It predicts that cofactor insufficiency creates rate-limiting steps in energy production, neural function, immune response, and protein synthesis simultaneously, which is why marginal micronutrient status produces diffuse performance impairment rather than a single obvious symptom.'
    }
  ],
  11: [
    {
      term: 'Energy availability',
      definition: 'The amount of dietary energy remaining to support normal physiology after exercise energy expenditure is accounted for.',
      why: 'It is the variable that explains why high-volume athletes can be simultaneously in energy surplus overall yet functionally underfueled — and why training demand raises nutritional requirements beyond simple caloric matching.',
      excellent_standard: 'An Excellent answer defines energy availability as the dietary energy remaining after subtracting exercise energy cost from total intake, and explains that this determines whether the body can sustain normal endocrine, immune, and reproductive function during training. It predicts that when energy availability drops too low — below approximately 30 kcal per kilogram of lean mass — physiological adaptations begin to protect essential functions at the expense of performance, recovery, and hormonal health, even when total caloric intake appears adequate by bodyweight standards. It connects this to why athletes in hard training blocks must deliberately increase intake proportionally to maintain function rather than eating what feels normal.'
    },
    {
      term: 'Nutrient timing',
      definition: 'The strategic placement of food intake relative to activity, sleep, or other physiological demands.',
      why: 'It is the variable that can meaningfully change outcomes in performance and body composition contexts even when total intake is held constant.',
      excellent_standard: 'An Excellent answer defines nutrient timing as the deliberate alignment of food intake with periods of elevated tissue demand and explains the mechanistic basis: post-exercise windows feature elevated GLUT4 expression, elevated insulin sensitivity, and active mTORC1 signaling — all of which enhance the anabolic and replenishment value of carbohydrate and protein consumed in that window. It qualifies that timing effects are meaningful but secondary to total intake — a person eating optimal amounts at wrong times will outperform someone eating suboptimal amounts at right times — and predicts that timing gains most practical value for athletes under high training volume where recovery windows are short and nutrient competition between workouts is high.'
    },
    {
      term: 'Tradeoff',
      definition: 'A situation in which improving one outcome often requires accepting limits or compromises in another.',
      why: 'It is the conceptual tool that dismantles the root question premise — there is no perfect diet because every optimization in one direction creates a real cost in another.',
      excellent_standard: 'An Excellent answer defines tradeoff as the necessary compromise between competing objectives and explains that nutritional tradeoffs are physiologically real, not merely inconvenient: maximizing fat loss requires a deficit that impairs muscle gain; maximizing muscle gain requires a surplus that prevents fat loss; maximizing adherence often requires accepting a less aggressive rate of change. It predicts that the person seeking a no-tradeoff perfect diet will cycle through extreme approaches, achieving none of their goals consistently, while someone who accepts tradeoffs and designs a diet around their primary objective will produce better outcomes over the same timeframe — making tradeoff awareness a fundamental nutritional literacy skill.'
    },
    {
      term: 'Diet structure',
      definition: 'The pattern of meals, food choices, timing, and constraints that determines how a diet functions in real life.',
      why: 'It is the practical layer that determines whether nutritional principles translate into sustained behavior — a strategy without structure fails regardless of how sound its physiology is.',
      excellent_standard: 'An Excellent answer defines diet structure as the operational organization of intake — meal timing, food selection boundaries, eating frequency, and flexibility rules — and explains that structure determines adherence by reducing decision fatigue, managing hunger patterns, and fitting real-life demands. It identifies that the person failing on strict diets in the adherence scenario is not lacking nutrition knowledge but lacking a structure compatible with their behavioral patterns and lifestyle. It predicts that building structure around the person\'s actual eating tendencies — reducing decisions, managing the environments that trigger overeating, building in planned flexibility — will produce better long-term outcomes than repeatedly attempting a theoretically optimal structure the person cannot maintain.'
    },
    {
      term: 'Maintenance phase',
      definition: 'A period in which energy intake is set to support relatively stable body weight rather than active gain or loss.',
      why: 'It helps distinguish the skills required for holding results from the skills required for creating change — and explains why the transition out of active dieting requires its own strategic framework.',
      excellent_standard: 'An Excellent answer defines a maintenance phase as a period of relative energy balance aimed at preserving body weight and body composition outcomes, explains that it requires sustainable structure and monitoring rather than aggressive restriction, and predicts that people who keep using unsustainably strict fat-loss behaviors in maintenance are more likely to rebound because the behaviors are not compatible with indefinite adherence. It identifies key maintenance skills — flexible structure, regular monitoring, sustainable food choices — as distinct from the deficit-focused skills of active fat loss.'
    }
  ]
};


export const BRANCH_RUBRICS = {
  1: {
    branch_1: `Criterion 1: Correctly identifies water and glycogen as the primary variables responsible for rapid early scale weight loss, distinguishing them from fat tissue loss. Criterion 2: Explains that energy balance continues to apply after the first week — the slowdown reflects a stabilizing of non-fat variables and a smaller true deficit as body weight drops, not a suspension of the underlying principle. Criterion 3: Predicts that ongoing fat loss continues at a slower but more representative rate once the initial water and glycogen shift has resolved.`,
    branch_2: `Criterion 1: Correctly identifies satiety-supporting food properties — higher protein, higher fiber, lower energy density — as the variables creating different hunger experiences despite identical calorie intake. Criterion 2: Identifies the behavioral risk of low-satiety eating as increased likelihood of unplanned eating or gradual drift into a surplus over time. Criterion 3: Predicts the person with lower satiety is more likely to drift into a caloric surplus through hunger-driven eating, explaining why identical intake targets do not guarantee identical real-world outcomes.`,
    branch_3: `Criterion 1: Correctly identifies fat mass and lean mass as the two compartments likely changing in opposite directions — modest fat loss alongside modest lean mass gain or retention — producing stable scale weight. Criterion 2: Explains that near-maintenance intake with resistance training does not violate energy balance because small changes in both directions can produce a near-zero net tissue change on the scale. Criterion 3: Predicts that body composition can improve measurably while scale weight remains stable, and identifies this as a reason why scale weight alone is an insufficient measure of body change during recomposition.`,
    branch_4: `Criterion 1: Correctly identifies at least two short-term non-fat variables that raise scale weight — such as sodium-driven water retention, glycogen refilling, digestive contents, hormonal fluid shifts, or increased food volume — and explains that none of these represent true fat gain. Criterion 2: Explains that energy balance continues to operate during these fluctuations and that the underlying fat-loss trajectory is not disrupted by a temporary scale increase. Criterion 3: Predicts that a consistent downward trend in scale weight over multiple weeks — not individual daily readings — is the meaningful signal for distinguishing ongoing fat loss from a genuine stall.`
  },
  2: {
    branch_1: `Criterion 1: Correctly identifies glycogen as the storage form of carbohydrate responsible for the rapid scale increase and explains the hydration mechanism — approximately 3 grams of water stored per gram of glycogen. Criterion 2: Explains that the associated body compartment changing alongside glycogen is intramuscular and hepatic water, not adipose tissue. Criterion 3: Correctly predicts that the weight gain is transient and will reverse if carbohydrate intake decreases or training stops, confirming that it does not represent fat accumulation.`,
    branch_2: `Criterion 1: Correctly identifies protein as the macronutrient most associated with satiety, lean mass retention, and structural repair, explaining why Diet A is more likely to support adherence during fat loss. Criterion 2: Identifies higher protein and fiber in Diet A as the primary adherence-supporting variables, and the low protein and highly refined composition of Diet B as the primary adherence risk factors. Criterion 3: Predicts Diet A is easier to sustain during fat loss because satiety is higher per calorie, hunger is more manageable, and lean mass is better protected — reducing the physiological pressure to abandon the diet.`,
    branch_3: `Criterion 1: Correctly identifies dietary fat as essential for fat-soluble vitamin absorption and steroid hormone precursor supply, explaining why driving fat intake excessively low creates functional deficits even when calories are adequate. Criterion 2: Identifies fat-soluble vitamins A, D, E, and K as the specific micronutrient class at risk when fat intake is chronically insufficient, because their absorption requires dietary fat to form gut micelles. Criterion 3: Predicts that hormonal disruption and progressive fat-soluble vitamin insufficiency are the most likely consequences of very low fat intake over months, and that these problems emerge before obvious clinical deficiency disease appears.`
  },
  3: {
    branch_1: `Criterion 1: Correctly identifies lipase insufficiency — not a dietary problem — as the specific digestive failure causing fat malabsorption, explaining why the problem persists regardless of diet quality. Criterion 2: Identifies steatorrhea (greasy, floating, or oily stool) as the most specific visible indicator of fat malabsorption, distinguishing it from general GI symptoms. Criterion 3: Predicts that chronic fat malabsorption progressively depletes fat-soluble vitamins A, D, E, and K because these require fat for gut absorption, making micronutrient status the most serious long-term nutritional risk beyond GI discomfort.`,
    branch_2: `Criterion 1: Correctly identifies the oral and gastric phase of eating — slower rate of ingestion, more thorough mechanical breakdown — as the stage most directly altered by slowing eating speed and chewing thoroughly. Criterion 2: Explains that earlier satiety signaling and reduced digestive load improve fullness and GI comfort because oral processing time allows cephalic phase responses and gastric stretch signals to develop before excess food is consumed. Criterion 3: Predicts that appetite and portion control are the downstream behaviors most likely to improve before measurable body composition changes occur, since behavioral changes upstream of digestion affect how much is eaten before caloric effects accumulate.`,
    branch_3: `Criterion 1: Correctly identifies that whole-food form requires more mechanical breakdown, slows gastric emptying, and engages more of the oro-sensory and gastric stretch satiety pathways — making it physiologically distinct from liquid calories even at the same caloric content. Criterion 2: Identifies the key digestive and satiety mechanisms affected by food form: gastric distension, chewing requirement, digestion rate, and hormonal satiety signaling — all reduced with highly processed liquid formats. Criterion 3: Predicts that highly processed liquid formats are easier to overconsume rapidly because they bypass the physical volume, chewing, and gastric stretch signals that normally slow intake and generate fullness.`
  },
  4: {
    branch_1: `Criterion 1: Correctly identifies hunger accumulation during restriction as the physiological driver — not a character flaw — explaining that persistent undereating elevates appetite hormones and depletes glycogen, creating mounting biological pressure to eat. Criterion 2: Identifies the behavioral pattern of all-or-nothing eating as mechanistically misleading because it ignores cumulative weekly energy balance — even a controlled diet on five days can be fully offset by two unrestricted days at high intake. Criterion 3: Predicts that moderating the daily deficit to a more sustainable level — reducing hunger accumulation — would most reduce the binge pattern, because it eliminates the physiological buildup that eventually overrides cognitive control.`,
    branch_2: `Criterion 1: Correctly identifies satiety per calorie — driven by protein content, fiber, water volume, and lower palatability — as the primary variable distinguishing Diet A from Diet B in practice, not the theoretical calorie deficit which is equal. Criterion 2: Identifies protein and fiber as the major adherence-supporting variables in Diet A, and the absence of these in Diet B as the major adherence risk even at equal calories. Criterion 3: Predicts Diet A is more stable over months because it sustains lower hunger, reduces deviation risk, and does not rely on precise portion control of highly palatable foods to maintain the deficit.`,
    branch_3: `Criterion 1: Correctly identifies that structured meals reduce the frequency of eating decisions — fewer opportunities for impulsive or habitual snacking — as the primary mechanism through which meal timing improves appetite control. Criterion 2: Identifies the behavioral pattern that improved as reduced grazing and decision fatigue, rather than a change in metabolic or hormonal function. Criterion 3: Predicts that structured eating reduces overeating risk for people prone to passive or habitual snacking by removing the continuous low-level decision context in which unconscious overconsumption occurs most easily.`,
    branch_4: `Criterion 1: Correctly identifies liquid calories, low chewing requirement, and rapid consumption rate as the food-form variables that weaken fullness signaling — specifically that liquid intake bypasses gastric stretch, oral processing time, and slower-releasing satiety hormones. Criterion 2: Explains that calorie intake can rise substantially through drinks and snackable foods without the person perceiving a "large meal," because the oral, mechanical, and stretch-based satiety pathways that register fullness are minimally activated. Criterion 3: Predicts that this pattern makes fat loss harder because passive overconsumption is easy, hunger is not well-controlled by these calories, and the person genuinely does not perceive themselves as overeating — creating a gap between subjective intake and actual caloric reality.`
  },
  5: {
    branch_1: `Criterion 1: Correctly identifies hepatic glucose output — specifically gluconeogenesis maintaining blood glucose during carbohydrate restriction — as the mechanism explaining modestly elevated fasting glucose on a very low carbohydrate diet without pathological insulin resistance. Criterion 2: Distinguishes adaptive glucose sparing (low insulin, elevated fasting glucose) from pathological insulin resistance (high insulin, elevated fasting glucose) as mechanistically opposite states requiring different interpretations. Criterion 3: Correctly predicts that fasting insulin is the most useful additional marker — low fasting insulin alongside mildly elevated fasting glucose points toward adaptive glucose sparing, while high fasting insulin alongside elevated glucose points toward true insulin resistance.`,
    branch_2: `Criterion 1: Correctly identifies glycogen demand created by training as the primary variable allowing the strength athlete to tolerate larger carbohydrate doses with less glucose disruption — muscle glycogen depletion creates a metabolic sink for incoming glucose. Criterion 2: Explains that carbohydrate timing around training aligns intake with the period of highest tissue demand and GLUT4 activity, while the sedentary worker's large late-night intake encounters low glycogen demand and reduced insulin sensitivity. Criterion 3: Predicts the strength athlete tolerates larger single carbohydrate doses with less postprandial glucose disruption because skeletal muscle acts as a high-capacity glucose buffer during and after training.`,
    branch_3: `Criterion 1: Correctly identifies contraction-induced GLUT4 translocation as the mechanism by which post-meal walking improves glucose disposal — muscle contraction independently activates GLUT4 surface expression via AMPK, bypassing the insulin signaling step that is impaired in insulin-resistant states. Criterion 2: Explains that this mechanism operates independently of body weight change, which is why glucose control can improve significantly before meaningful fat loss occurs. Criterion 3: Correctly predicts postprandial glucose improves first — because the contraction-GLUT4 mechanism directly targets the post-meal glucose spike — while fasting glucose, which is regulated by hepatic mechanisms and overnight insulin sensitivity, changes more slowly and requires more systemic improvement.`,
    branch_4: `Criterion 1: Correctly identifies co-consumed protein, fat, and fiber as meal-context variables that slow gastric emptying and reduce the rate of glucose entry into the bloodstream, blunting the postprandial glucose spike even when total carbohydrate grams are matched. Criterion 2: Identifies post-meal physical activity as a separate variable that further improves glucose disposal through GLUT4 activation, compounding the mixed-meal effect. Criterion 3: Correctly predicts the mixed meal followed by walking produces a meaningfully smaller postprandial glucose spike than the isolated carbohydrate meal, and explains that this does not mean carbohydrate grams are irrelevant — only that the glycemic response is contextual, not fixed.`
  },
  6: {
    branch_1: `Criterion 1: Correctly identifies sleep as the primary non-nutritional physiological process being neglected — specifically that deep sleep is the period of peak growth hormone secretion and the primary window for tissue repair and protein synthesis signaling. Criterion 2: Explains that protein provides the substrate for synthesis but cannot substitute for the hormonal signaling environment that drives synthesis — adequate leucine intake cannot compensate for absent or blunted growth hormone pulses. Criterion 3: Predicts that the adaptation pathway still being limited is overnight tissue repair and anabolic signaling, explaining why more protein fails to fully solve impaired recovery when the hormonal environment required to use that protein is compromised by sleep deprivation.`,
    branch_2: `Criterion 1: Correctly identifies that high-protein diets support lean mass retention during dieting through two distinct mechanisms — direct substrate provision for protein synthesis and elevated satiety reducing adherence failures that would deepen the deficit unpredictably. Criterion 2: Identifies preservation of lean mass as the major structural advantage of high protein during dieting — protecting the metabolically active tissue that determines resting energy expenditure and physical capacity post-diet. Criterion 3: Predicts the low-protein diet leaves the person more vulnerable to ending the diet with worse body composition — greater lean mass loss relative to fat — which lowers post-diet maintenance intake and increases rebound risk.`,
    branch_3: `Criterion 1: Correctly identifies lean mass gain — or retention combined with fat loss — as the body compartment most likely responsible for the apparent contradiction: scale weight rises modestly while appearance improves. Criterion 2: Explains that simultaneous lean mass increase and fat loss (body recomposition) is possible in novice lifters, especially with adequate protein and training, producing a scale weight increase alongside visible improvement. Criterion 3: Predicts that focusing only on scale weight in this scenario leads to the incorrect interpretation that progress has stalled or reversed — and that body composition measures (circumference, photos, performance) would confirm improvement that scale weight obscures.`
  },
  7: {
    branch_1: `Criterion 1: Correctly identifies energy balance — total caloric intake relative to expenditure — as the variable explaining why body fat remains stable despite high fat intake: the person is in energy balance or a slight deficit, so net fat storage does not occur regardless of fat intake percentage. Criterion 2: Explains that this outcome does not contradict fat metabolism principles because the mechanism of fat storage is always energy surplus converted to triglycerides, and absence of surplus prevents accumulation regardless of macronutrient ratio. Criterion 3: Correctly predicts that if fat intake increases further and total calories exceed expenditure, body fat will rise — because energy surplus, not fat intake per se, is the governing variable for net fat storage.`,
    branch_2: `Criterion 1: Correctly identifies at least two non-energy physiological roles of dietary fat: fat-soluble vitamin absorption and structural roles in cell membranes or hormone precursor supply. Criterion 2: Explains that the higher-fat diet is not automatically worse because dietary fat itself does not determine fat gain — energy balance does — and adequate fat intake supports essential physiological functions. Criterion 3: Predicts that chronically very low fat intake impairs fat-soluble vitamin absorption and hormonal function progressively, producing functional deficits before obvious disease — explaining why the lower-fat diet is not automatically superior even when calorie-matched.`,
    branch_3: `Criterion 1: Correctly identifies that blood lipid improvements reflect changes in lipoprotein metabolism — reduced hepatic triglyceride production, improved VLDL clearance, altered LDL particle composition — driven by fat loss, exercise, and dietary pattern rather than simply by reducing dietary fat intake. Criterion 2: Explains that blood lipids are transport markers, not direct reflections of dietary fat consumed: triglycerides in blood are elevated primarily by insulin resistance and carbohydrate excess, while LDL and HDL reflect lipoprotein turnover rates affected by body composition and metabolic health. Criterion 3: Predicts that metabolic context — insulin sensitivity, body composition, exercise, overall dietary pattern — matters as much as dietary fat intake for lipid panel outcomes, explaining why improvements exceed what body weight change alone would predict.`
  },
  8: {
    branch_1: `Criterion 1: Correctly identifies fermentability as the key variable distinguishing fiber types in IBS-like presentations — highly fermentable fibers (FODMAPs, inulin, fructooligosaccharides) produce more gas and osmotic water shifts in the gut, while less fermentable fibers (psyllium, oat bran) are generally better tolerated. Criterion 2: Explains that the broad claim "fiber is healthy" remains true at the population level for gut function, satiety, and metabolic health, but is incomplete for individuals with hypersensitive gut motility or reduced tolerance for fermentation byproducts. Criterion 3: Predicts that personalized tolerance — trial of specific fiber sources, adjustment of fermentability load — is more practically useful than broad fiber recommendations for people with IBS-like symptoms, and that identifying well-tolerated sources is achievable without eliminating fiber entirely.`,
    branch_2: `Criterion 1: Correctly identifies satiety per calorie as the primary variable improved by higher fiber intake — increased food volume, slower gastric emptying, and fiber's effect on appetite hormones produce greater fullness at the same or lower caloric intake. Criterion 2: Identifies stool quality and glycemic stability as additional variables improved before body composition changes — fiber adds bulk and water to stool improving transit, while slowing carbohydrate absorption blunts postprandial glucose response. Criterion 3: Predicts the higher-fiber whole food eater feels fuller per calorie over time and shows improved stool regularity and more stable postprandial glucose, with these functional improvements preceding meaningful changes in body weight or fat mass.`,
    branch_3: `Criterion 1: Correctly identifies gut motility as the gut function variable most directly influenced by the behavioral changes listed — meal timing synchronizes with circadian motility patterns, hydration softens stool and facilitates transit, and walking stimulates enteric nervous system activity and peristalsis. Criterion 2: Explains that these behavioral changes address the fundamental physiological regulators of digestion — circadian rhythms, hydration state, physical activity — rather than treating the symptom with a supplement that bypasses the underlying driver. Criterion 3: Predicts that consistent behavioral change reliably improves GI outcomes before specialized interventions are needed in many cases, because the root drivers of motility and digestive function are primarily behavioral and physiological rather than requiring targeted pharmaceutical or supplement correction.`
  },
  9: {
    branch_1: `Criterion 1: Correctly identifies lean mass retention as the primary structural tissue difference between the two dieters — the person who used resistance training and high protein retained more lean mass, while the crash dieter lost a greater proportion of lean mass alongside fat. Criterion 2: Explains that lean mass differences matter post-diet because lean mass sets resting metabolic rate — the person with greater lean mass loss has a lower post-diet maintenance intake, making it easier to re-enter a surplus on the same food intake. Criterion 3: Predicts the crash dieter is at greater risk of rebound weight gain because their lower post-diet resting metabolic rate means their pre-diet calorie intake now constitutes a surplus, while the person who preserved lean mass has a higher maintenance intake that provides more buffer before a surplus is reached.`,
    branch_2: `Criterion 1: Correctly identifies NEAT suppression as the compensatory response — increased exercise leads to unconscious reduction in spontaneous movement outside the workout, reducing total daily energy expenditure and shrinking the true deficit. Criterion 2: Explains that this still fits energy balance because total daily energy expenditure (not just exercise calories) is what matters — if NEAT falls by as much as exercise adds, the net deficit is unchanged or smaller than expected. Criterion 3: Predicts NEAT reduction is the hidden variable most likely responsible for the smaller-than-expected scale change, since it is the most variable and least consciously monitored component of daily energy expenditure.`,
    branch_3: `Criterion 1: Correctly identifies partial restoration of adaptive thermogenesis components — leptin, thyroid function, sympathetic tone, and NEAT — as the physiological mechanism explaining improved performance and adherence after a diet break at maintenance. Criterion 2: Explains that short-term scale slowdown is expected during a diet break but that this represents a strategic restoration of the metabolic and behavioral conditions for sustainable dieting rather than a true loss of progress. Criterion 3: Predicts that if the restored variables — reduced hunger, higher NEAT, better training capacity — allow a larger and more sustainable deficit on resumption, total fat loss over the full period can exceed what would have occurred without the break, making short-term slowdown a net positive for long-term outcomes.`
  },
  10: {
    branch_1: `Criterion 1: Correctly identifies dietary diversity as the mechanism linking food variety to micronutrient coverage — different foods contain different micronutrient profiles, so a narrow diet cannot provide the full range even at high caloric intake. Criterion 2: Explains that caloric and protein sufficiency address energy and structural protein needs but do not guarantee micronutrient completeness, because vitamins and minerals are distributed unevenly across food categories and cannot be replaced by eating more of a narrow food group. Criterion 3: Predicts iron, zinc, magnesium, and B vitamins as micronutrients most likely to be inadequate in a narrow high-calorie diet that lacks variety across meat, vegetables, legumes, and whole grains — because these are distributed across distinct food categories not easily covered by a single food type.`,
    branch_2: `Criterion 1: Correctly identifies that calorie sufficiency guarantees energy provision but not micronutrient completeness, and that dietary diversity is what provides coverage across the full spectrum of vitamins and minerals. Criterion 2: Explains that reliance on refined convenience foods creates micronutrient gaps because food processing typically removes or fails to provide many vitamins and minerals present in minimally processed whole foods. Criterion 3: Predicts the person eating low dietary diversity is more likely to develop subtle functional problems first — such as fatigue, impaired immune response, slower recovery, or poor mood — because micronutrient insufficiency degrades physiology continuously before producing dramatic deficiency disease.`,
    branch_3: `Criterion 1: Correctly identifies bioavailability — the fraction of ingested nutrient actually absorbed and used — as the variable explaining how adequate dietary intake can coexist with poor nutritional status when absorption is impaired. Criterion 2: Explains that digestive dysfunction — enzyme insufficiency, intestinal inflammation, altered motility, or reduced absorptive surface — can reduce bioavailability of multiple nutrients simultaneously, creating functional deficits despite complete dietary intake on paper. Criterion 3: Predicts that digestive function matters as much as diet content in determining nutritional status in individuals with absorption problems, and that supplementation alone may fail to solve the problem if the absorption impairment is not addressed directly.`
  },
  11: {
    branch_1: `Criterion 1: Correctly identifies satiety and hunger management as the highest-priority variables for this person, given that hunger and late-night overeating are the identified failure points — and prioritizes these over maximum speed of fat loss. Criterion 2: Identifies high-protein, high-volume, high-fiber foods as the meal qualities most likely to help — specifically because these properties address the fullness-per-calorie problem that is causing adherence failure. Criterion 3: Predicts that the most likely plan-failure mode is setting a caloric target that looks correct on paper but uses food choices with insufficient satiety per calorie — producing correct math but incorrect behavioral outcomes.`,
    branch_2: `Criterion 1: Correctly identifies total caloric intake as the primary nutritional variable that must increase for this person, since unintentional under-eating is the identified limiting factor — not training quality, sleep, or protein source. Criterion 2: Explains why total intake is the bottleneck: without sufficient energy, the anabolic environment required for muscle gain cannot be sustained regardless of training quality, and protein synthesis is competed for by energy demands. Criterion 3: Predicts that a strictly "clean" eating style paradoxically slows muscle gain for this person because high-satiety, low-energy-density foods make reaching a caloric surplus difficult — the very properties that aid fat loss impair surplus building when appetite is the limiting factor.`,
    branch_3: `Criterion 1: Correctly identifies the problem as a diet design failure — the plan is too aggressive to maintain beyond two weeks — rather than a willpower or discipline failure, and identifies restriction severity and satiety as the design variables that need to change. Criterion 2: Explains that a less aggressive deficit with better adherence produces more total fat loss over time than a larger deficit that breaks every two weeks and triggers rebound, because cumulative adherence determines real-world outcomes more than theoretical deficit size. Criterion 3: Predicts that a more repeatable plan — moderate deficit, adequate satiety, planned flexibility — will outperform the theoretically faster plan over a 3 to 6 month horizon, and identifies this as a principle that holds even when the faster plan would work perfectly if adhered to.`,
    branch_4: `Criterion 1: Correctly identifies total energy availability and carbohydrate as the highest-priority nutritional variables for a hard-training athlete — not protein optimization or micronutrient detail — because flat workouts and poor recovery most directly reflect underfueling rather than micronutrient gaps or training errors. Criterion 2: Explains why carbohydrate matters specifically: it is the primary fuel for moderate-to-high intensity training, and its insufficiency limits both training output and glycogen resynthesis between sessions, compounding fatigue over a hard training week. Criterion 3: Predicts that eating too "clean" and too little during high training output creates a state of low energy availability — the body progressively downregulates non-essential functions including hormonal output, immune function, and training adaptation — a risk that worsens the harder the person trains without adjusting intake upward.`,
    branch_5: `Criterion 1: Correctly identifies the key priority shift in maintenance: moving from active deficit management to intake regulation at energy balance, with emphasis on sustainable structure and monitoring rather than restriction. Criterion 2: Explains why maintenance requires different skills than active fat loss — fat loss is driven by sustained restriction, which is inherently temporary; maintenance requires a repeatable eating pattern that can be sustained indefinitely without active caloric restraint. Criterion 3: Predicts that the most likely cause of rebound is continuing to use active fat-loss behaviors — very low intake, high restriction, avoidance of flexible eating — because these are not sustainable long-term and eventually produce compensatory overconsumption when abandoned, rather than the gradual behavioral stabilization that successful maintenance requires.`
  }
};

