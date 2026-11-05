/* Original candidate B2 First Reading and Use of English materials. Pending external review. */
(function(){
const themes=[["repair cafés","volunteers","household objects","waste","community workshops"],["urban gardens","residents","unused land","fresh food","neighbourhood projects"],["night trains","passengers","long-distance journeys","carbon emissions","rail travel"],["local museums","curators","forgotten objects","regional history","public collections"],["citizen science","volunteers","wildlife observations","research data","scientific projects"],["shared workshops","makers","tools and materials","expensive equipment","practical skills"],["independent bookshops","readers","local events","online competition","literary communities"],["river restoration","environmental groups","damaged waterways","native species","long-term recovery"],["community theatres","performers","small productions","limited budgets","creative collaboration"],["historic cinemas","campaigners","old buildings","local landmarks","cultural heritage"]];
const letters=['A','B','C','D'];
function rotate(a,n){return a.slice(n).concat(a.slice(0,n))}
function makeTest(i){
 const [topic,people,object,problem,benefit]=themes[i];
 const shift=i%4, pick=(arr,q)=>rotate(arr,(shift+q)%arr.length);
 const p1opts=[
  ['approach','method','direction','manner'],
  ['up','away','off','out'],
  ['discarded','dismissed','removed','rejected'],
  ['obtain','achieve','collect','reach'],
  ['equipped','prepared','trained','arranged'],
  ['impact','impression','influence','outcome'],
  ['contributing','belonging','relating','responding'],
  ['rid','free','clear','out']
 ];
 const p1answers=[0,0,0,0,0,0,0,0].map((_,q)=>letters[(shift+[0,1,2,3,1,2,3,0][q])%4]);
 const p1Text=`In many towns, ${topic} are encouraging people to take a different approach to everyday problems. Rather than replacing something immediately, ${people} look for practical ways to extend its useful life. Supporters argue that this can reduce the amount of ${problem} that ends up being wasted, while also giving participants a stronger sense of connection to their community. Of course, not every attempt is successful: replacement parts can be difficult to obtain and some items are damaged beyond repair. Even so, organisers say that participants become better equipped to deal with similar situations in the future. As awareness of the environmental impact of unnecessary consumption grows, these projects are increasingly seen as contributing to wider changes in behaviour. For many people, the social side is equally important, since strangers can work together and exchange ideas. This sense of cooperation is one reason why people are reluctant to get rid of projects that still have potential.`;
 const p2answers=['on','out','with','our','for','to','that','along'];
 const p2Text=`People often claim to dislike uncertainty, yet many enjoyable experiences depend on it. A story whose ending can be guessed easily is unlikely to leave much of an impression. When events turn out differently from our expectations, we pay closer attention. Not every surprise is pleasant, of course; the difference often depends on whether we feel able to cope with the situation. We may think we have considered every possibility, only to discover that something escaped our notice. This is why uncertainty can be appealing: we can imagine several outcomes without knowing for certain which will occur. However, if there is too little information, curiosity may give way to frustration. The most satisfying experiences provide enough information to create expectations, but not so much that there is nothing left to discover. Looking back, we often realise that the clues were there all along.`;
 const p3=[
  ['definition','DEFINE'],['environmental','ENVIRONMENT'],['emotional','EMOTION'],['impulsive','IMPULSE'],
  ['obsessive','OBSESS'],['meaningful','MEANING'],['freedom','FREE'],['considerably','CONSIDER']
 ];
 const p3Text=`A growing number of people have become interested in ${topic}. There is no single definition of what this movement should involve. For some, the motivation is environmental; for others, the attraction is more emotional. Experts warn against impulsive decisions and against becoming obsessive about following a particular lifestyle. The aim should be to make meaningful choices and to gain greater freedom from unnecessary possessions. Personal circumstances can vary considerably, so no single solution is right for everyone.`;
 const trans=[
  ['I had never seen such an impressive collection before.','MOST','It was the most impressive collection I had ever seen.','the most impressive collection'],
  ['It was not necessary for Mia to attend the meeting.','NEED','Mia did not need to attend the meeting.','did not need to attend'],
  ['The heavy rain prevented us from continuing our walk.','STOPPED','We were stopped from continuing our walk by the heavy rain.','were stopped from continuing'],
  ['I regret not taking my teacher’s advice.','WISH','I wish I had taken my teacher’s advice.','wish I had taken'],
  ['People say that the project is planning to expand.','SAID','The project is said to be planning to expand.','is said to be'],
  ['The last time I visited the place was three years ago.','FOR','I have not visited the place for three years.','have not visited the place for']
 ];
 const p5Title=`Places and people: photographing ${object}`;
 const p5Passage=`When photographer Elena first became interested in ${topic}, she had no intention of beginning a long-term project. She had taken her camera almost as an afterthought, but what she saw affected her unexpectedly. The most striking feature was the contrast between visible change and small signs of ordinary life. Over time, her work attracted attention online, which created a problem she had not anticipated. People began asking for exact locations and access details. Elena realised she had to be careful: some places were dangerous and others were private. She also became uncomfortable with the idea that a location should be treated simply as an attractive background. Every site had a human history. For this reason, she now researches carefully before taking photographs, searches local archives and speaks to people who remember events connected with the place. These conversations often change what she notices. Details that once seemed unimportant can suddenly become meaningful. Elena believes this development in her understanding is what keeps the project interesting.`;
 const p5Qs=[
  ['What first interested Elena?',['an unexpected contrast','a planned architectural study','a friend’s photography skills','a technical challenge'],'A'],
  ['What problem followed the project’s popularity?',['She received requests for information that could be misused.','She could no longer find suitable locations.','Other photographers copied her work.','Her equipment became too expensive.'],'A'],
  ['Why does Elena research each location?',['To understand the human history behind it.','To guarantee permission to enter it.','To discover the cheapest route there.','To avoid speaking to local people.'],'A'],
  ['What can conversations change?',['The significance she gives to details.','The age of the buildings.','The quality of her camera.','The number of photographs she takes.'],'A'],
  ['What keeps the project interesting for Elena?',['Her developing understanding of the places.','The competition with other photographers.','The possibility of becoming famous.','The speed of online publishing.'],'A'],
  ['Which summary best reflects the text?',['Research has made her work more thoughtful.','Photography has become less important to her.','She prefers modern buildings to old ones.','She avoids locations with difficult histories.'],'A']
 ];
 const sentences=[
  'That discovery changed the way I organised every practice session.',
  'At first, however, I assumed that spending more time would automatically produce better results.',
  'The answer was to divide difficult tasks into much smaller goals.',
  'This was particularly clear when I compared two recordings made several weeks apart.',
  'As a result, progress became easier to notice and less dependent on my mood.',
  'Even so, there were occasions when I needed to change my plan completely.',
  'For that reason, I now regard careful reflection as part of practising rather than a separate activity.'
 ];
 const p6Paras=[
  'When I began learning a new skill as an adult, I expected the difficult part to be understanding the technique.',
  'I soon discovered that the real challenge was learning how to practise effectively.',
  'My early sessions were long but unfocused, and improvement was difficult to measure.',
  'Eventually I started keeping brief notes about what had worked and what had not.',
  'This helped me recognise patterns that would otherwise have remained invisible.',
  'The experience taught me that progress is rarely the result of effort alone.'
 ];
 const peopleText=[
  ['A',`I joined a ${topic} project because a relative gave me the idea. I found the first attempt difficult, but I enjoyed learning practical skills and want to continue.`],
  ['B',`I expected to work alone, but the best part was cooperating with other ${people}. The final result surprised me and changed my plans.`],
  ['C',`The activity was a present from a friend. I had to organise my time carefully and learned a great deal after making an early mistake.`],
  ['D',`I was interested mainly in the challenge. A family member offered useful help, and the experience convinced me to try something completely new.`]
 ];
 const p7Qs=[
  ['Who enjoyed learning something practical?','A'],['Who was surprised by the result?','B'],['Who preferred working with other people?','B'],['Who found the first attempt difficult?','A'],['Who wants to continue with the activity?','A'],['Who mentioned help from a relative?','D'],['Who had to organise their time carefully?','C'],['Who learned from making a mistake?','C'],['Who chose the activity because it was a present?','C'],['Who says the experience changed future plans?','B']
 ];
 return {id:`b2-rue-original-${String(i+1).padStart(2,'0')}`,title:`B2 Reading and Use of English Candidate Test ${i+1}`,status:'candidate',parts:{
  1:{title:topic,text:p1Text,options:p1opts.map((o,q)=>pick(o,q)),answers:p1answers},
  2:{title:'Why uncertainty can be enjoyable',text:p2Text,answers:p2answers},
  3:{title:`A closer look at ${topic}`,text:p3Text,words:p3,answers:p3.map(x=>x[0])},
  4:{items:trans.map(x=>({a:x[0],keyword:x[1],b:x[2],answer:x[3]}))},
  5:{title:p5Title,text:p5Passage,questions:p5Qs},
  6:{title:'Learning to practise',paragraphs:p6Paras,sentences:sentences,answers:['B','A','C','D','E','G']},
  7:{title:`Four people describe experiences with ${topic}`,people:peopleText,questions:p7Qs}
 }};
}
window.RUE_TESTS=Array.from({length:10},(_,i)=>makeTest(i));
})();