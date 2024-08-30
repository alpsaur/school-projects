package sg.nus.iss.adproj.funsg.model.utils;

import java.util.*;

public class MBTIWordList {

    private static final Map<String,List<String>> wordsSentencesMap = new HashMap<>();

    static {
        // Analysts (_NT_)
        Map<String, List<String>> INTJMap = new HashMap<>();
        Map<String, List<String>> INTPMap = new HashMap<>();
        Map<String, List<String>> ENTJMap = new HashMap<>();
        Map<String, List<String>> ENTPMap = new HashMap<>();

        // Diplomats (_NF_)
        Map<String, List<String>> INFJMap = new HashMap<>();
        Map<String, List<String>> INFPMap = new HashMap<>();
        Map<String, List<String>> ENFJMap = new HashMap<>();
        Map<String, List<String>> ENFPMap = new HashMap<>();

        // Sentinels (_S_J)
        Map<String, List<String>> ISTJMap = new HashMap<>();
        Map<String, List<String>> ISFJMap = new HashMap<>();
        Map<String, List<String>> ESTJMap = new HashMap<>();
        Map<String, List<String>> ESFJMap = new HashMap<>();

        // Explorers (_S_P)
        Map<String, List<String>> ISTPMap = new HashMap<>();
        Map<String, List<String>> ISFPMap = new HashMap<>();
        Map<String, List<String>> ESTPMap = new HashMap<>();
        Map<String, List<String>> ESFPMap = new HashMap<>();

        // INTJ
        INTJMap.put("analyze", Arrays.asList(
                "My cat's uncanny ability to find sunny spots makes me wonder if she can analyze sunbeam trajectories.",
                "Trying to analyze my dreams is like decoding a surrealist painting while riding a rollercoaster.",
                "I spent hours trying to analyze why my houseplants keep dying, only to realize I forgot to water them.",
                "My attempt to analyze my coffee addiction led to a shocking revelation: I might actually be part coffee bean.",
                "When I analyze my life choices, I realize that my spirit animal might be a confused penguin."
        ));

        INTJMap.put("strategize", Arrays.asList(
                "We tried to strategize our pizza toppings, but hunger won and we ordered everything on the menu.",
                "My plan to strategize a morning routine fell apart when I discovered the snooze button's magical powers.",
                "Attempting to strategize my cat's diet backfired spectacularly when she learned to open the treat jar.",
                "I thought I could strategize my way through a maze, but ended up more lost than a sock in a dryer.",
                "My efforts to strategize a New Year's resolution resulted in a vague promise to eat more cake."
        ));

        INTJMap.put("innovate", Arrays.asList(
                "My nephew decided to innovate his sandwich by adding gummy bears and pickles – surprisingly tasty!",
                "Attempting to innovate my morning coffee, I accidentally created a new form of jet fuel.",
                "My cat seems determined to innovate new ways of waking me up at ungodly hours.",
                "I tried to innovate a new dance move, but it looked more like I was fighting an invisible octopus.",
                "My brother's attempt to innovate gift-wrapping resulted in a present that looked like modern art."
        ));

        INTJMap.put("systemize", Arrays.asList(
                "I attempted to systemize my bookshelf but ended up with a 'mystery' section for books I forgot I owned.",
                "My effort to systemize my sock drawer resulted in a color-coded chaos that would baffle a rainbow.",
                "Trying to systemize my Netflix watching habits only revealed the depths of my procrastination skills.",
                "I thought I could systemize my cat's playtime, but she had other plans involving 3 AM zoomies.",
                "My attempt to systemize my snack drawer turned into an impromptu taste-testing marathon."
        ));

        INTJMap.put("conceptualize", Arrays.asList(
                "Late at night, I lie awake trying to conceptualize a machine that turns Monday mornings into Friday afternoons.",
                "I'm struggling to conceptualize how my dog always knows when I'm about to eat something delicious.",
                "Trying to conceptualize my ideal vacation is like planning an expedition to a chocolate planet.",
                "I can't quite conceptualize how I manage to lose socks in a washing machine that doesn't open mid-cycle.",
                "My efforts to conceptualize the perfect sandwich led to a towering monstrosity that defied gravity and nutrition."
        ));

        // INTP
        INTPMap.put("theorize", Arrays.asList(
                "I like to theorize about parallel universes where socks never go missing in the laundry.",
                "My friends and I theorize that our neighborhood squirrel is secretly plotting world domination.",
                "Let's theorize why pizza tastes better when someone else pays for it.",
                "I often theorize about what my cat is thinking when she stares at me judgmentally.",
                "My sister and I theorize that our parents have a secret language for discussing our shenanigans."
        ));

        INTPMap.put("debate", Arrays.asList(
                "I could debate the merits of pineapple on pizza until the cows come home.",
                "My roommate and I regularly debate whether cereal is a soup or not.",
                "I'm ready to debate anyone who says that unicorns wouldn't make excellent pets.",
                "Let's debate which superpower is better: invisibility or the ability to talk to animals.",
                "I often debate with myself whether it's worth getting out of bed on cold mornings."
        ));

        INTPMap.put("hypothesize", Arrays.asList(
                "Scientists hypothesize that dogs dream about chasing squirrels, but I think they plot treat heists.",
                "I hypothesize that socks disappear in the dryer because they're eloping to a parallel universe.",
                "Let's hypothesize why we park on driveways but drive on parkways.",
                "I hypothesize that my plants die because they can't handle my overzealous pep talks.",
                "My friend and I hypothesize that our local cafe's 'secret ingredient' is just a sprinkle of sass."
        ));

        INTPMap.put("question", Arrays.asList(
                "I question why we don't eat birthday cake for breakfast every day.",
                "Sometimes I question if my cat is secretly judging my life choices.",
                "Let's question the logic behind 'one size fits all' clothing labels.",
                "I often question why alarm clocks are designed to make the most annoying sounds possible.",
                "My brother and I question whether our childhood tree house could qualify as a real estate investment."
        ));

        INTPMap.put("experiment", Arrays.asList(
                "I decided to experiment with cooking by adding glitter to my pasta sauce.",
                "Let's experiment with using interpretive dance to explain quantum physics.",
                "My roommate and I like to experiment with creating new ice cream flavors like 'Procrastination Pistachio'.",
                "I'm going to experiment with teaching my goldfish to play fetch.",
                "My friends and I experiment with different strategies to avoid being 'it' in tag."
        ));

        // ENTJ
        ENTJMap.put("lead", Arrays.asList(
                "I naturally lead the way when my friends can't decide where to eat, efficiently narrowing down options in record time.",
                "Let me lead this project; I'll turn this group of procrastinators into a well-oiled productivity machine.",
                "I'm determined to lead by example, showing everyone that early mornings are the key to conquering the day.",
                "When I lead a team, even the coffee machine falls in line with our efficiency-driven schedule.",
                "I've decided to lead a revolution against inefficient meetings – we'll call it 'Operation Time-Saver'."
        ));

        ENTJMap.put("decide", Arrays.asList(
                "I can decide in seconds which Netflix show we're binging tonight, saving us hours of scrolling indecision.",
                "Let's decide right now to transform this chaotic workspace into a beacon of organization and productivity.",
                "I've learned to quickly decide which social invitations to accept based on their networking potential and time efficiency.",
                "When it comes to deciding between work and play, I choose both – productivity is my playground.",
                "I'll decide our group's weekend plans; spontaneity is great, but a well-structured itinerary is better."
        ));

        ENTJMap.put("plan", Arrays.asList(
                "My five-year plan includes dominating my industry, learning three languages, and finally organizing my sock drawer.",
                "Let's plan our vacation with military precision – every moment of relaxation will be perfectly optimized.",
                "I plan to revolutionize the snooze button industry by creating an alarm that motivates you out of bed.",
                "My idea of a perfect date is to plan our shared empire over a strategic game of chess.",
                "I plan my days so efficiently that even my downtime is scheduled for maximum recharge and productivity."
        ));

        ENTJMap.put("achieve", Arrays.asList(
                "I will achieve my goal of reading 100 books this year, even if it means multitasking during my sleep.",
                "Let's achieve greatness together – I've already drafted a 10-step plan for our inevitable success.",
                "I'm determined to achieve the perfect work-life balance by optimizing every second of my existence.",
                "Watch me achieve in a day what others do in a week – efficiency isn't just a goal, it's a lifestyle.",
                "I'll achieve my dream of world domination, or at least domination of the office ping-pong tournament."
        ));

        ENTJMap.put("implement", Arrays.asList(
                "Time to implement my foolproof strategy for turning this lazy Sunday into a powerhouse of productivity.",
                "Let's implement a new system that turns our coffee breaks into mini brainstorming sessions.",
                "I'm ready to implement my master plan for reorganizing the entire office – resistance is futile.",
                "We need to implement a strict 'no excuses' policy for missed deadlines – efficiency waits for no one.",
                "I've decided to implement a personal growth initiative: 'Project Awesome' – phase one starts now!"
        ));

        // ENTP
        ENTPMap.put("brainstorm", Arrays.asList(
                "Let's brainstorm ways to convince my cat that 3 AM is not the ideal time for parkour practice.",
                "I need to brainstorm excuses for why I binge-watched an entire series instead of doing laundry.",
                "We should brainstorm new ice cream flavors, like 'Procrastination Praline' or 'Midlife Crisis Mint'.",
                "Help me brainstorm methods to telepathically communicate with pizza delivery drivers for faster service.",
                "I'm trying to brainstorm ways to make my plants look alive before my mom visits."
        ));


        ENTPMap.put("improvise", Arrays.asList(
                "I had to improvise a dance routine when I tripped on stage, now they call me 'The Worm Whisperer'.",
                "Let's improvise a new language using only food puns and see how long until someone notices.",
                "I attempted to improvise a bedtime story for my nephew, accidentally created a new mythology.",
                "When I forgot my lines in the play, I decided to improvise a soliloquy about the existential crisis of socks.",
                "I'll improvise a gourmet meal using whatever I find in this suspiciously old tupperware container."
        ));

        ENTPMap.put("challenge", Arrays.asList(
                "I challenge anyone to go a full day without saying 'like' or 'um' – it's harder than you think!",
                "Let's challenge the notion that adulthood means giving up on building epic pillow forts.",
                "I decided to challenge myself to a staring contest with my reflection, pretty sure I'm winning.",
                "My roommate and I challenge each other to create the most outrageous sandwich combinations possible.",
                "I challenge the idea that talking to plants doesn't help – my ficus and I have great conversations."
        ));

        ENTPMap.put("invent", Arrays.asList(
                "I'm trying to invent a device that translates my dog's barks into Shakespearean sonnets.",
                "Let's invent a new sport that combines chess, trampolining, and extreme couponing.",
                "I want to invent a time machine, but I'm too busy procrastinating on social media.",
                "My goal is to invent a teleportation device, mainly to avoid awkward goodbyes at parties.",
                "I'm determined to invent a way to fold fitted sheets that doesn't defy the laws of physics."
        ));

        ENTPMap.put("explore", Arrays.asList(
                "I love to explore the vast universe of my refrigerator at 2 AM, discovering new life forms.",
                "Let's explore the mysterious realm of my roommate's room – I hear strange noises from there.",
                "I want to explore the possibility that my socks are secretly eloping in the dryer.",
                "Today, I'll explore the untamed wilderness of my overflowing email inbox.",
                "I'm going to explore the theory that my plants are plotting against me for forgetting to water them."
        ));

        // INFJ
        INFJMap.put("counsel", Arrays.asList(
                "I tried to counsel my cat on the importance of personal space, but she just stared at me judgmentally.",
                "Let me counsel you on the art of perfecting the 'I'm listening' nod while daydreaming about tacos.",
                "I often counsel my plants on photosynthesis techniques, but I think they're giving me the silent treatment.",
                "My friend asked me to counsel her on dating, so I shared my expertise on Netflix marathons and pizza ordering.",
                "I need someone to counsel me on how to stop buying books faster than I can read them."
        ));

        INFJMap.put("empathize", Arrays.asList(
                "I empathize with my coffee maker's morning groans – we both struggle to function before 10 AM.",
                "Let's empathize with socks that lose their partners in the mysterious void of the laundry machine.",
                "I deeply empathize with my phone's battery life – we're both constantly drained and in need of recharging.",
                "Sometimes I empathize so hard with fictional characters that I forget to have a life of my own.",
                "I empathize with the lone broccoli in my fridge, we both feel a bit out of place sometimes."
        ));

        INFJMap.put("envision", Arrays.asList(
                "I envision a world where pizza is considered a balanced meal and naps are mandatory.",
                "Let's envision a future where autocorrect actually understands what we're trying to duck-ing say.",
                "I often envision myself gracefully dancing through life, but reality is more like a clumsy stumble.",
                "Sometimes I envision my plants throwing a party when I'm not home, discussing their #PlantLife problems.",
                "I envision a day when I'll finally fold and put away that laundry I did three weeks ago."
        ));

        INFJMap.put("inspire", Arrays.asList(
                "My cat's judgemental stare inspires me to be a better human, or at least to refill her food bowl.",
                "Let's inspire each other to reach new heights, like finally cleaning out the 'misc' drawer in the kitchen.",
                "The way my dog gets excited about walks inspires me to find joy in the simple things, like naps.",
                "I hope to inspire others to embrace their inner weirdness and dance like nobody's watching (but everyone is).",
                "My overflowing bookshelf inspires me to read more, or at least to buy more bookshelves."
        ));

        INFJMap.put("reflect", Arrays.asList(
                "As I reflect on my life choices, I wonder if my spirit animal is a sloth or a very confused penguin.",
                "Let's take a moment to reflect on why we thought cutting our own bangs was a good idea.",
                "I often reflect on the deep mysteries of the universe, like why we park on driveways and drive on parkways.",
                "When I reflect on my productivity, I realize I excel at finding new ways to procrastinate.",
                "Staring at my reflection in a spoon makes me reflect on the bendiness of reality and my face."
        ));

        // INFP
        INFPMap.put("dream", Arrays.asList(
                "I often dream about a world where chocolate is a vegetable and naps are considered productive work.",
                "Last night, I had a dream where my socks finally revealed where they disappear to in the dryer.",
                "Sometimes I dream of being a superhero whose power is always having the perfect witty comeback.",
                "I frequently dream about my cat secretly being a philosopher, judging my life choices with silent contempt.",
                "Let's dream up a reality where plants give pep talks and trees high-five you for recycling."
        ));

        INFPMap.put("idealize", Arrays.asList(
                "I tend to idealize my future self as someone who doesn't procrastinate by watching 'just one more' episode.",
                "My friend likes to idealize me as a functional adult, but little does she know about my cereal dinners.",
                "I idealize a world where introverts get gold stars for successfully avoiding small talk.",
                "Let's not idealize the past; I'm pretty sure Shakespeare never had to deal with autocorrect fails.",
                "I often idealize my cooking skills, forgetting that one time I burned water."
        ));

        INFPMap.put("harmonize", Arrays.asList(
                "I'm trying to harmonize my love for pizza with my desire to fit into my favorite jeans.",
                "Let's harmonize our schedules so we can be productively lazy together, binge-watching shows in sync.",
                "I attempted to harmonize my cat's meows into a symphony, but it sounds more like a chaos concerto.",
                "My goal is to harmonize my sleep schedule with my coffee addiction for peak productivity... someday.",
                "I strive to harmonize my inner child's desire for fun with my adult self's need to pay bills."
        ));

        INFPMap.put("create", Arrays.asList(
                "I love to create elaborate excuses for why I haven't started that project I promised to finish months ago.",
                "Let's create a new dance move that perfectly captures the essence of stepping on a Lego brick.",
                "I often create intricate backstories for the dust bunnies I find under my bed.",
                "My hobby is to create new words for experiences like finding that one cold spot on your pillow.",
                "I want to create a time machine, mostly to give myself more time to procrastinate."
        ));

        INFPMap.put("imagine", Arrays.asList(
                "I like to imagine my houseplants are secretly plotting world domination while I'm at work.",
                "Let's imagine a world where calories don't count on weekends or when eaten standing up.",
                "I often imagine my future self thanking me for finally organizing that one drawer full of random stuff.",
                "Sometimes I imagine my wifi router gets offended when I aggressively unplug and replug it.",
                "I enjoy imagining what my dog would say if she could talk, probably a lot about squirrels and treats."
        ));

        // ENFJ
        ENFJMap.put("mentor", Arrays.asList(
                "I tried to mentor my cat in the art of relaxation, but I think she's already got a PhD in napping.",
                "Let me mentor you in the ancient wisdom of turning it off and on again to fix any tech issue.",
                "I've decided to mentor my houseplants, sharing my expertise in the field of barely staying alive.",
                "My coffee maker has become my mentor in the delicate art of waking up and facing the day.",
                "I'm looking for someone to mentor me in the mystical practice of folding fitted sheets properly."
        ));

        ENFJMap.put("motivate", Arrays.asList(
                "I motivate myself to exercise by imagining I'm training to outrun the zombie apocalypse.",
                "Let's motivate each other to adult today by promising pizza and Netflix as a reward.",
                "I try to motivate my plants to grow by sharing inspirational quotes, but they seem to prefer water.",
                "My alarm clock thinks it can motivate me to wake up early, but my bed has other plans.",
                "I motivate myself to clean by pretending I'm destroying an evil dust bunny empire."
        ));

        ENFJMap.put("nurture", Arrays.asList(
                "I nurture my creativity by doodling in meetings and pretending it's 'visual note-taking'.",
                "Let's nurture our inner children by eating ice cream for dinner and building pillow forts.",
                "I nurture my dreams of becoming a superhero by wearing my underwear over my pants.",
                "My strategy to nurture friendships involves sending memes at 3 AM and hoping for the best.",
                "I'm learning to nurture my bank account by pretending the mall doesn't exist."
        ));

        ENFJMap.put("teach", Arrays.asList(
                "I'll teach you the ancient art of looking busy while daydreaming about vacation.",
                "Let me teach you my secret technique for turning 'I'll do it tomorrow' into a lifestyle.",
                "I'm qualified to teach a masterclass in finding excuses to avoid social gatherings.",
                "My dog is trying to teach me the joy of chasing squirrels, but I'm a slow learner.",
                "I could teach a course on the fine art of procrastination, but I keep putting it off."
        ));

        ENFJMap.put("encourage", Arrays.asList(
                "I encourage my pizza to be its best self by adding extra cheese and toppings.",
                "Let's encourage each other to embrace our quirkiness and dance like no one's judging (they probably are).",
                "I encourage my wifi router with pep talks, hoping it'll finally give me a stable connection.",
                "My mirror encourages me every morning by showing someone who vaguely resembles a functional adult.",
                "I encourage my car to start each morning with a mix of sweet talk and mild threats."
        ));

        // ENFP
        ENFPMap.put("socialize", Arrays.asList(
                "I tried to socialize with my houseplants, but they gave me the silent treatment.",
                "Let's socialize by sitting in the same room and staring at our phones together.",
                "I socialize with my cat by narrating my daily activities to her judging eyes.",
                "My idea of socializing is exchanging memes with strangers on the internet at 2 AM.",
                "I decided to socialize my socks by introducing them to the mysterious realm of the dryer."
        ));

        ENFPMap.put("entertain", Arrays.asList(
                "I entertain myself by imagining my refrigerator's shock when I actually cook instead of ordering takeout.",
                "Let me entertain you with my incredible talent for tripping over absolutely nothing.",
                "I tried to entertain my goldfish with a standup routine, but I think he's just not that into me.",
                "My plants find it highly entertaining when I attempt to dance while watering them.",
                "I entertain the idea of being a morning person every night before hitting snooze 17 times."
        ));

        ENFPMap.put("energize", Arrays.asList(
                "Coffee doesn't just wake me up, it energizes my ability to pretend I'm a functioning adult.",
                "Let's energize our creativity by procrastinating on important tasks and inventing new excuses.",
                "I energize my workout routine by imagining I'm training to outrun my responsibilities.",
                "My dog's zoomies energize the entire household, especially at 3 AM when everyone's sleeping.",
                "I tried to energize my brain cells with energy drinks, but they're on an extended coffee break."
        ));

        ENFPMap.put("express", Arrays.asList(
                "I express my feelings through interpretive dance, mostly involving dramatic falls and confused looks.",
                "Let me express my love for you by sharing my last piece of pizza... just kidding, get your own.",
                "My face expertly expresses my thoughts when someone says, 'Let's go around and introduce ourselves.'",
                "I express my creativity by giving my WiFi network passive-aggressive names aimed at my neighbors.",
                "My cat expresses her opinion of my life choices through strategic hairball placement."
        ));

        ENFPMap.put("appreciate", Arrays.asList(
                "I appreciate my bed more and more as I get older; it's like a time machine to tomorrow.",
                "Let's take a moment to appreciate the bravery of the first person who looked at a coconut and said 'food'.",
                "I truly appreciate my phone's effort to autocorrect my typos into completely unrelated words.",
                "My taste buds appreciate the culinary masterpiece that is cold pizza for breakfast.",
                "I've come to appreciate the artistic value of the dust patterns in my room; it's abstract art, really."
        ));

        // ISTJ
        ISTJMap.put("organize", Arrays.asList(
                "I organize my bookshelf by genre, author, and color, because finding the right book quickly is essential.",
                "My spice rack is organized alphabetically, making it easy to locate ingredients efficiently while cooking.",
                "I've organized my closet by clothing type and color, ensuring I can assemble an outfit in record time.",
                "Let me organize the group project; I'll create a spreadsheet to track everyone's tasks and deadlines.",
                "I organize my daily schedule in 15-minute increments to maximize productivity and minimize wasted time."
        ));

        ISTJMap.put("structure", Arrays.asList(
                "I structure my weekends to balance chores, relaxation, and social activities for optimal efficiency.",
                "A well-structured to-do list is the foundation of a productive day, so I always make mine the night before.",
                "I've structured my budget using a tried-and-true method that accounts for every penny spent and saved.",
                "Let's structure this presentation logically, with clear sections and bullet points for easy comprehension.",
                "I structure my workout routine to target different muscle groups each day, ensuring consistent progress."
        ));

        ISTJMap.put("detail", Arrays.asList(
                "The devil is in the details, which is why I always double-check my work before submitting it.",
                "I enjoy planning trips down to the last detail, including backup plans for potential disruptions.",
                "Let me handle the project details; I'll create a comprehensive checklist to ensure nothing is overlooked.",
                "I keep a detailed log of my car's maintenance, because prevention is better than costly repairs.",
                "My recipe book is filled with detailed notes on each dish, recording every tweak for future reference."
        ));

        ISTJMap.put("maintain", Arrays.asList(
                "I maintain a neat and orderly home, believing that an organized space leads to an organized mind.",
                "It's important to maintain a consistent sleep schedule, even on weekends, for optimal health and productivity.",
                "I maintain detailed records of all financial transactions, which makes tax season a breeze.",
                "Let's maintain open communication in this project; I'll send weekly update emails to keep everyone informed.",
                "I maintain a journal to track my goals and progress, helping me stay focused and accountable."
        ));

        ISTJMap.put("manage", Arrays.asList(
                "I manage my time efficiently by using the Pomodoro technique and avoiding unnecessary distractions.",
                "Let me manage the team's schedule; I'll ensure everyone's workload is balanced and deadlines are met.",
                "I manage stress by sticking to a routine and tackling tasks one at a time, in order of priority.",
                "It's crucial to manage expectations in any project, so I always clarify roles and timelines upfront.",
                "I manage to keep my inbox at zero by immediately sorting emails into action folders or archives."
        ));

        // ISFJ
        ISFJMap.put("support", Arrays.asList(
                "I support my friend's decision to become a professional nap-taker, it's a tough job but someone's gotta do it.",
                "Let's support each other's delusions that we'll actually use that gym membership we bought in January.",
                "I fully support my cat's ambition to take over the world, as long as I get to be the official treat dispenser.",
                "My couch supports my weight and my life choices without judgment, and that's true friendship.",
                "I support my plants' right to remain silent, but anything they photosynthesize can be used against them in a garden."
        ));

        ISFJMap.put("remember", Arrays.asList(
                "I can remember every cringe-worthy moment from middle school, but ask me what I had for breakfast and I'm clueless.",
                "Let me remember my grocery list: something, something else, and that thing we always forget to buy.",
                "I remember a time when I thought being an adult meant eating ice cream for dinner whenever I wanted.",
                "My brain can remember every lyric to songs from the 90s, but important meetings? Not a chance.",
                "I wish I could remember where I put my keys with the same clarity I remember embarrassing moments from 10 years ago."
        ));

        ISFJMap.put("protect", Arrays.asList(
                "I protect my personal space like a dragon guards its hoard, except my treasure is peace and quiet.",
                "Let's protect our snacks from the notorious office food thief by setting up elaborate Home Alone-style traps.",
                "I will protect my right to wear pajamas all day with the ferocity of a mama bear defending her cubs.",
                "My immune system tries its best to protect me, but it's more like a sleepy security guard than a navy seal.",
                "I protect my weekend plans of doing absolutely nothing as if they were the crown jewels."
        ));

        ISFJMap.put("care", Arrays.asList(
                "I care deeply about my plants, which is why I've named each one and apologize when I forget to water them.",
                "Let me care for your houseplants while you're on vacation – I promise they'll only be slightly traumatized.",
                "I care about the environment, which is why I reuse the same coffee mug... for days at a time.",
                "My cat pretends not to care, but I caught her checking on me when I sneezed – I knew she had a heart!",
                "I care about staying fit, which is why I do intense mental gymnastics to justify my sedentary lifestyle."
        ));

        ISFJMap.put("preserve", Arrays.asList(
                "I'm trying to preserve my youth, but my back pain and disdain for loud noises aren't cooperating.",
                "Let's preserve the ancient art of making up lyrics when we don't know the real ones.",
                "I preserve my energy throughout the day so I can unleash my full power when it's time to panic before deadlines.",
                "My fridge is working overtime to preserve the mystery leftovers that have been there since... well, who knows?",
                "I'm determined to preserve my reputation as the person least likely to remember anyone's birthday without Facebook reminders."
        ));

        // ESTJ
        ESTJMap.put("direct", Arrays.asList(
                "I tried to direct traffic in my kitchen, but my cats just ignored me and created a furry pileup.",
                "Let me direct you to the nearest coffee shop – just follow the trail of my desperation and caffeine withdrawal.",
                "I can confidently direct you to the best napping spots in any given room.",
                "My attempts to direct my life have the same energy as a toddler steering a shopping cart.",
                "I like to direct my complaints about the weather to the clouds, but they seem to give me the cold shoulder."
        ));

        ESTJMap.put("execute", Arrays.asList(
                "I execute my plans to get in shape with the same precision as a sloth on vacation.",
                "Let's execute Operation Couch Potato with military precision and an arsenal of snacks.",
                "I execute my morning routine with all the grace of a giraffe on roller skates.",
                "My cat expects me to execute her royal commands, but I'm more of a benign dictatorship.",
                "I can execute a flawless pizza order in my sleep, but ask me to make a phone call and I panic."
        ));

        ESTJMap.put("efficiency", Arrays.asList(
                "My efficiency in finding excuses is directly proportional to the importance of the task I'm avoiding.",
                "Let's discuss the efficiency of my procrastination techniques – I've turned it into an art form.",
                "I've mastered the efficiency of looking busy while doing absolutely nothing productive.",
                "My brain's efficiency at remembering song lyrics far exceeds its ability to recall important dates.",
                "I'm working on improving the efficiency of my Netflix binge-watching – fewer bathroom breaks, more snacks."
        ));

        ESTJMap.put("order", Arrays.asList(
                "I bring order to my chaotic life by alphabetizing my spice rack while ignoring the mountain of laundry.",
                "Let's restore order to this room by shoving everything into the closet and never opening it again.",
                "I create order in my workspace by arranging my procrastination tools from least to most distracting.",
                "My attempt to impose order on my sock drawer resulted in a cotton-based civil war.",
                "I maintain order in my home by following the sacred rule: if it's on the floor, it's where it belongs."
        ));

        ESTJMap.put("supervise", Arrays.asList(
                "I supervise my plant's growth with the intensity of a helicopter parent watching their kid's first steps.",
                "Let me supervise your cooking adventure – I'm an expert at ordering takeout when things go wrong.",
                "I closely supervise my dog's squirrel-watching activities to ensure maximum tail-wagging efficiency.",
                "As I supervise my laundry, I ponder the great sock-eating conspiracy of the dryer underworld.",
                "I've been appointed to supervise the office snack supply, a responsibility I take very seriously (and deliciously)."
        ));

        // ESFJ
        ESFJMap.put("cooperate", Arrays.asList(
                "I tried to cooperate with my cat on a cleaning schedule, but she vetoed everything except nap time.",
                "Let's cooperate on this pizza order: you choose the toppings, and I'll eat most of it.",
                "I'm willing to cooperate with morning people, as long as they don't expect me to speak before coffee.",
                "My left and right socks have finally agreed to cooperate and match, it's a laundry day miracle!",
                "I attempted to cooperate with my diet, but the cookies launched a successful rebellion."
        ));

        ESFJMap.put("assist", Arrays.asList(
                "I'm always ready to assist in any pizza-eating emergency, it's basically my superpower.",
                "Let me assist you in perfecting the art of professional procrastination, I'm somewhat of an expert.",
                "I'd love to assist you with your workout routine, I'll be the supportive voice cheering from the couch.",
                "My plants have requested that I assist them less, apparently overwatering isn't a sign of extra love.",
                "I'm happy to assist in any Netflix binge-watching sessions, I consider it a civic duty."
        ));

        ESFJMap.put("coordinate", Arrays.asList(
                "I tried to coordinate my outfit, but ended up looking like a rainbow had a fight with a crayon box.",
                "Let's coordinate our schedules to maximize our synchronized napping potential.",
                "I attempt to coordinate my life, but my cat's random zoomies keep throwing off my timing.",
                "My efforts to coordinate a group chat always end with me talking to myself for hours.",
                "I can barely coordinate my own limbs, let alone a complex project involving actual responsible adults."
        ));

        ESFJMap.put("facilitate", Arrays.asList(
                "I facilitate smooth communication between my stomach and the fridge, it's a 24/7 job.",
                "Let me facilitate your journey to the land of procrastination, I know all the shortcuts.",
                "I'm here to facilitate the important decision between ordering takeout and reheating leftovers.",
                "My role is to facilitate peace talks between my cat and the evil red dot from the laser pointer.",
                "I've been chosen to facilitate the distribution of office cake, a task I take very seriously."
        ));

        ESFJMap.put("serve", Arrays.asList(
                "I'm always ready to serve as a taste-tester for any experimental ice cream flavors.",
                "Let me serve you by demonstrating the perfect technique for avoiding responsibilities while looking busy.",
                "I humbly serve as the official translator for my cat's various meows and judgmental stares.",
                "My purpose in life is to serve as a cautionary tale for what happens when you don't read the instructions.",
                "I'm here to serve as your guide through the treacherous world of assembling IKEA furniture without losing sanity."
        ));

        // ISTP
        ISTPMap.put("craft", Arrays.asList(
                "I can craft excuses faster than a politician can dodge a tough question.",
                "Let me craft you a sandwich that will make your taste buds question their life choices.",
                "I tried to craft a clever tweet, but my cat walked across the keyboard and accidentally wrote Shakespeare.",
                "My ability to craft puns is so powerful, it should be classified as a lethal weapon.",
                "I once tried to craft a DIY project, and now I have a new abstract art installation in my living room."
        ));

        ISTPMap.put("troubleshoot", Arrays.asList(
                "I spent hours trying to troubleshoot my printer, only to realize it wasn't plugged in.",
                "Let's troubleshoot why my plants keep dying despite my constant hovering and excessive encouraging talks.",
                "I can troubleshoot any tech issue, as long as the solution involves turning it off and on again.",
                "My attempts to troubleshoot my sleep schedule have resulted in me becoming nocturnal.",
                "I've been asked to troubleshoot the office coffee machine, which I suspect is possessed by a caffeine demon."
        ));

        ISTPMap.put("adapt", Arrays.asList(
                "I can adapt to any situation, as long as it involves couches, snacks, or avoiding human interaction.",
                "Let's see how quickly I can adapt to winning the lottery – I'm willing to take on this challenge.",
                "My cat has learned to adapt to my work-from-home routine by scheduling her naps on my keyboard.",
                "I'm trying to adapt to eating healthier, but the cookies keep calling my name in a seductive whisper.",
                "Watch me adapt to this new exercise routine by creatively redefining what counts as a 'workout'."
        ));

        ISTPMap.put("observe", Arrays.asList(
                "I keenly observe the behavior of my houseplants, suspecting they're plotting a chlorophyll revolution.",
                "Let me observe your cooking technique so I can learn how to summon the fire department more efficiently.",
                "I like to observe people in coffee shops and imagine elaborate backstories for them.",
                "My hobby is to observe my neighbor's cat, who I'm convinced is a secret agent on a covert mission.",
                "I carefully observe my dog's pre-nap ritual, hoping to unlock the secret to perfect relaxation."
        ));

        ISTPMap.put("fix", Arrays.asList(
                "I can fix any bad mood with a strategically timed cat video or a well-placed pun.",
                "Let me fix your day by sharing this embarrassing story about how I tried to high-five a automatic door.",
                "I attempted to fix my sleep schedule, but my Netflix account had other plans.",
                "My superpower is the ability to fix any recipe by adding cheese, yes, even desserts.",
                "I'm determined to fix the space-time continuum so that Monday mornings no longer exist."
        ));

        // ISFP
        ISFPMap.put("compose", Arrays.asList(
                "I tried to compose a love song for my cat, but it mostly consisted of meows and the sound of a can opener.",
                "Let me compose a haiku about my coffee addiction: 'Dark liquid, life force, Without you I'm just a zombie, One more cup, please, thanks.'",
                "I can compose a symphony of excuses faster than Beethoven could write a sonata.",
                "My attempt to compose a healthy grocery list somehow turned into a poem about ice cream.",
                "I'm working to compose myself after seeing the pile of dishes I've successfully ignored all week."
        ));

        ISFPMap.put("sense", Arrays.asList(
                "I can sense the presence of chocolate from three rooms away, it's my superpower.",
                "Let's see if you can sense the sarcasm dripping from my voice when I say I love Monday mornings.",
                "I'm trying to develop a sixth sense for knowing when my phone is at 1% battery life.",
                "My dog seems to sense exactly when I'm about to take a bite of food and gives me the puppy eyes.",
                "I can sense the judgemental aura emanating from my plants when I forget to water them... again."
        ));

        ISFPMap.put("harmonize", Arrays.asList(
                "I attempted to harmonize my sleep schedule with my coffee intake, resulting in a chaotic caffeine opera.",
                "Let's harmonize our schedules so we can be productively lazy together and binge-watch shows in perfect sync.",
                "I try to harmonize my diet between 'eating my feelings' and 'feeling what I eat', with mixed results.",
                "My cat and I have harmonized our daily routines: she ignores me, and I cater to her every whim.",
                "I'm working on harmonizing my expectation of adulting with the reality of eating cereal for dinner... again."
        ));

        ISFPMap.put("individualize", Arrays.asList(
                "I like to individualize my outfits by ensuring that no two socks ever match.",
                "Let me individualize your coffee order by adding my secret ingredient: more coffee.",
                "I've decided to individualize my approach to fitness by counting 'reaching for the TV remote' as arm day.",
                "My attempt to individualize my handwriting has resulted in doctors asking me for prescription-writing tips.",
                "I strive to individualize my procrastination techniques, turning avoidance into an art form."
        ));

        ISFPMap.put("create", Arrays.asList(
                "I love to create new words for experiences like finding that one cold spot on your pillow.",
                "Let's create a new dance move that perfectly captures the essence of stepping on a Lego brick.",
                "I often create intricate backstories for the dust bunnies I find under my bed.",
                "My hobby is to create new conspiracy theories about why socks disappear in the dryer.",
                "I'm determined to create a time machine, mostly to give myself more time to procrastinate."
        ));

        // ESTP
        ESTPMap.put("act", Arrays.asList(
                "I tried to act cool when I tripped in public, but ended up looking like a startled flamingo doing interpretive dance.",
                "Let's act like we're sophisticated adults by eating cheese and crackers for dinner, but with our pinkies up.",
                "I can act like a morning person, but my Oscar-worthy performance crumbles at the first hint of actual sunlight.",
                "When life gives you lemons, act like you wanted limes and make margaritas instead.",
                "I've perfected the art of acting busy at work, which mostly involves furrowing my brow at a blank screen."
        ));

        ESTPMap.put("compete", Arrays.asList(
                "I compete with myself to see how long I can procrastinate before panic-induced productivity kicks in.",
                "Let's compete to see who can come up with the most creative excuse for being late to the party.",
                "My cat and I often compete for the sunniest spot on the couch, and I usually lose.",
                "I'm ready to compete in the Olympic sport of binge-watching - I've been training my whole life for this.",
                "My plants compete for my attention, but the cactus is winning because it requires the least effort."
        ));

        ESTPMap.put("persuade", Arrays.asList(
                "I can persuade myself that one more episode won't hurt, even when my alarm is set for 5 AM.",
                "Let me persuade you that pineapple on pizza is a culinary masterpiece, not a crime against humanity.",
                "I've mastered the art of persuading my dog that car rides aren't portal to the vet every single time.",
                "My skills at persuading myself that I'll go to the gym 'tomorrow' are unmatched and highly refined.",
                "I'm trying to persuade my houseplants that my black thumb is actually a sign of affection."
        ));

        ESTPMap.put("perform", Arrays.asList(
                "I perform my best magic trick every morning: making coffee disappear at an alarmingly fast rate.",
                "Let's perform a dramatic reenactment of our last attempt to assemble IKEA furniture without the instructions.",
                "I can perform complex mental gymnastics to justify ordering takeout instead of cooking a healthy meal.",
                "Watch me perform the delicate balancing act of carrying all the grocery bags in one trip.",
                "I'm ready to perform my one-person show titled 'Conversations I Rehearsed in the Shower But Never Had'."
        ));

        ESTPMap.put("promote", Arrays.asList(
                "I promote myself as a professional napper, with years of experience and a impressive portfolio of drool patterns.",
                "Let me promote the revolutionary idea of breakfast for dinner... pancakes at 8 PM is peak adulting.",
                "I'm here to promote the concept that scrolling through memes counts as a productive use of time.",
                "My cat has hired me to promote her new business venture: professional laptop keyboard warmer.",
                "I passionately promote the idea that talking to plants helps them grow, especially if you're apologizing for forgetting to water them."
        ));

        // ESFP
        ESFPMap.put("play", Arrays.asList(
                "I organize my bookshelf by genre, author, and color, because finding the right book quickly is essential.",
                "My spice rack is organized alphabetically, making it easy to locate ingredients efficiently while cooking.",
                "I've organized my closet by clothing type and color, ensuring I can assemble an outfit in record time.",
                "Let me organize the group project; I'll create a spreadsheet to track everyone's tasks and deadlines.",
                "I organize my daily schedule in 15-minute increments to maximize productivity and minimize wasted time."
        ));

        ESFPMap.put("entertain", Arrays.asList(
                "I structure my weekends to balance chores, relaxation, and social activities for optimal efficiency.",
                "A well-structured to-do list is the foundation of a productive day, so I always make mine the night before.",
                "I've structured my budget using a tried-and-true method that accounts for every penny spent and saved.",
                "Let's structure this presentation logically, with clear sections and bullet points for easy comprehension.",
                "I structure my workout routine to target different muscle groups each day, ensuring consistent progress."
        ));

        ESFPMap.put("share", Arrays.asList(
                "The devil is in the details, which is why I always double-check my work before submitting it.",
                "I enjoy planning trips down to the last detail, including backup plans for potential disruptions.",
                "Let me handle the project details; I'll create a comprehensive checklist to ensure nothing is overlooked.",
                "I keep a detailed log of my car's maintenance, because prevention is better than costly repairs.",
                "My recipe book is filled with detailed notes on each dish, recording every tweak for future reference."
        ));

        ESFPMap.put("engage", Arrays.asList(
                "I maintain a neat and orderly home, believing that an organized space leads to an organized mind.",
                "It's important to maintain a consistent sleep schedule, even on weekends, for optimal health and productivity.",
                "I maintain detailed records of all financial transactions, which makes tax season a breeze.",
                "Let's maintain open communication in this project; I'll send weekly update emails to keep everyone informed.",
                "I maintain a journal to track my goals and progress, helping me stay focused and accountable."
        ));

        ESFPMap.put("experience", Arrays.asList(
                "I manage my time efficiently by using the Pomodoro technique and avoiding unnecessary distractions.",
                "Let me manage the team's schedule; I'll ensure everyone's workload is balanced and deadlines are met.",
                "I manage stress by sticking to a routine and tackling tasks one at a time, in order of priority.",
                "It's crucial to manage expectations in any project, so I always clarify roles and timelines upfront.",
                "I manage to keep my inbox at zero by immediately sorting emails into action folders or archives."
        ));
        wordsSentencesMap.putAll(INTJMap);
        wordsSentencesMap.putAll(INTPMap);
        wordsSentencesMap.putAll(ENTJMap);
        wordsSentencesMap.putAll(ENTPMap);
        wordsSentencesMap.putAll(INFJMap);
        wordsSentencesMap.putAll(INFPMap);
        wordsSentencesMap.putAll(ENFJMap);
        wordsSentencesMap.putAll(ENFPMap);
        wordsSentencesMap.putAll(ISTJMap);
        wordsSentencesMap.putAll(ISFJMap);
        wordsSentencesMap.putAll(ESTJMap);
        wordsSentencesMap.putAll(ESFJMap);
        wordsSentencesMap.putAll(ISTPMap);
        wordsSentencesMap.putAll(ISFPMap);
        wordsSentencesMap.putAll(ESTPMap);
        wordsSentencesMap.putAll(ESFPMap);
    }
    public static Map<String,String> getMBTIWords() {
        Map<String,String> selectedWordsSentencesMap = new HashMap<>();
        List<String> keyList = wordsSentencesMap.keySet().stream().toList();

        while(selectedWordsSentencesMap.size() <= 3) {
            Random rnd = new Random();
            String randomWord = keyList.get(rnd.nextInt(keyList.size()));
            selectedWordsSentencesMap.put(randomWord
                    ,wordsSentencesMap.get(randomWord).get(rnd.nextInt(5)));
        }

        return selectedWordsSentencesMap;
    }
}
