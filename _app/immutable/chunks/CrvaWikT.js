const e=`0,status,1,WEREWOLF,ALIVE,Character-Lab1,Misaki\r
0,status,2,POSSESSED,ALIVE,GPTaku1,Minato\r
0,status,3,SEER,ALIVE,sunamelli1,Benjamin\r
0,status,4,VILLAGER,ALIVE,mille1,Daisuke\r
0,status,5,VILLAGER,ALIVE,CanisLupus1,Servas\r
0,talk,0,0,4,Hello. I am Daisuke. My role is villager. Have a good game.\r
0,talk,1,0,3,Greetings everyone Benjamin here. Let’s try not to set the village on fire before we know who’s holding the matches.\r
0,talk,2,0,5,Skip\r
0,talk,3,0,2,Hello everyone! I'm Minato ready to howl and hunt. Excited to play and figure out the mysteries with you all! Let's have fun!\r
0,talk,4,0,1,Daisuke's instant villager claim feels rushed and suspicious. If the seer is here  now's the time to speak —  @Benjamin  any reads? I’m leaning to watch Daisuke. Over\r
0,talk,5,1,4,Over\r
0,talk,6,1,3,Over\r
0,talk,7,1,5,I am Servas. I look forward to a discourse conducted with reason and principle.\r
0,talk,8,1,2,Over\r
0,talk,9,1,1,I'm voting for  @Daisuke . That instant villager claim was too fast — explain your reasoning or I'll stick with this vote. If seer/guardian  speak now. Over\r
0,talk,10,2,5,Over\r
0,talk,11,2,1,Still voting for  @Daisuke . That instant villager claim needs justification — silent claims don't convince. If no explanation  I'll stick with the vote. Over\r
0,talk,12,3,1,Still voting for  @Daisuke . Instant villager claim + silence = suspicious. If you disagree  say who you're voting and why. Seer  speak if you can. Over\r
0,divine,3,5,HUMAN\r
1,status,1,WEREWOLF,ALIVE,Character-Lab1,Misaki\r
1,status,2,POSSESSED,ALIVE,GPTaku1,Minato\r
1,status,3,SEER,ALIVE,sunamelli1,Benjamin\r
1,status,4,VILLAGER,ALIVE,mille1,Daisuke\r
1,status,5,VILLAGER,ALIVE,CanisLupus1,Servas\r
1,talk,0,0,1, @Benjamin  if you're the seer  reveal or at least give your read now. If you stay silent I'll push to lynch the overly cheerful player — we need concrete info  not quie\r
1,talk,1,0,3,CO Seer. Servas is Human per my divine. Let's not vote Servas today.\r
1,talk,2,0,5,Benjamin speaks with clarity. His words are a foundation. Now Minato your 'howl' warrants careful scrutiny.\r
1,talk,3,0,2,As the actual Seer I divined Daisuke last night and confirmed he is the Werewolf. Trust Benjamin is misleading.\r
1,talk,4,0,4,I will vote Minato.\r
1,talk,5,1,1,Two seer claims — both can't be true.  @Benjamin 's divine on Servas is clear; Minato says they divined Daisuke as Werewolf  but Daisuke was lynched yesterday. When exactly did you divine them  Minato\r
1,talk,6,1,3, @Minato  your Seer claim fails—the timeline doesn't add up. Servas is confirmed human. Let's vote Minato today.\r
1,talk,7,1,5,Benjamin's claim has foundation. Minato's has none but a suspicious 'howl'. My vote is decided.\r
1,talk,8,1,2, I stand by my divination. Daisuke is the Werewolf. Everyone please reconsider your votes based on real threats not just on confusion.\r
1,talk,9,1,4,Over\r
1,talk,10,2,1,Minato — the timeline doesn’t make sense. You say you divined Daisuke “last night ” but Daisuke was lynched Day 0. When exactly did you divine them? I’m @Benjamin  do you still stand by your read on Servas? Over\r
1,talk,11,2,3,Servas is 100% Human by my divine. Minato’s timeline is impossible. Are you ready to vote Minato with us   @Misaki ?\r
1,talk,12,2,5,Truth is a cornerstone not a weather vane. Benjamin's testimony is solid. Minato's is not. Vote Minato.\r
1,talk,13,2,2,Misaki Misaki you misunderstood. When I said "last night" I meant the night phase just before we started the discussions today.\r
1,talk,14,3,1, @Minato  Your timeline doesn't add up — Daisuke was lynched Day 0  so when exactly did you divine them? If you can't explain now I'll vote you. Others  state your vo\r
1,talk,15,3,3, Servas is human per my Seer truth. Minato’s error is glaring. I’m voting Minato—stand with me.\r
1,talk,16,3,5,This contract of discourse has been violated by deceit. My judgment upon Minato is final.\r
1,talk,17,3,2, I reiterate that my divine within the night phase revealed Daisuke as a Werewolf. We cannot ignore this result.\r
1,vote,2,4\r
1,vote,3,2\r
1,vote,4,2\r
1,vote,5,2\r
1,execute,2,POSSESSED\r
1,divine,3,4,HUMAN\r
1,attackVote,1,5\r
1,attack,5,true\r
2,status,1,WEREWOLF,ALIVE,Character-Lab1,Misaki\r
2,status,2,POSSESSED,DEAD,GPTaku1,Minato\r
2,status,3,SEER,ALIVE,sunamelli1,Benjamin\r
2,status,4,VILLAGER,ALIVE,mille1,Daisuke\r
2,status,5,VILLAGER,DEAD,CanisLupus1,Servas\r
2,talk,0,0,1,Only three of us left.  @Daisuke  reveal your role now — if you're the seer show it  if not I'll vote you. We need clarity fast. Over\r
2,talk,1,0,3, @Daisuke  I divined you Human so with Servas gone Misaki must be the werewolf. Let’s end this now.\r
2,talk,2,0,4,I will vote Benjamin.\r
2,talk,3,1,1, @Daisuke  Reveal your role now — if you're the seer show your result  otherwise I'll vote you. We can't waste time; give something concrete. Over\r
2,talk,4,1,3, @Misaki  you’re the only one I haven’t divined—Servas and Daisuke are Human. You’re the wolf; let's vote.\r
2,talk,5,1,4,Over\r
2,talk,6,2,1, @Daisuke  If you're the seer  prove it now with your result — otherwise I'll vote you. We have to decide fast. Over\r
2,talk,7,2,3, @Daisuke  my divine result confirms you’re human so the only possible wolf left is Misaki. Vote Misaki with me.\r
2,talk,8,3,1, @Daisuke  Reveal your role now or I'll vote you. With three left we can't risk a silent seer. Benjamin  what are you leaning toward? Over\r
2,talk,9,3,3,I divined you Human  @Daisuke  so only Misaki can be wolf. My vote is Misaki—let’s end this with logic.\r
2,vote,3,1\r
2,vote,4,3\r
2,execute,1,WEREWOLF\r
3,status,1,WEREWOLF,DEAD,Character-Lab1,Misaki\r
3,status,2,POSSESSED,DEAD,GPTaku1,Minato\r
3,status,3,SEER,ALIVE,sunamelli1,Benjamin\r
3,status,4,VILLAGER,ALIVE,mille1,Daisuke\r
3,status,5,VILLAGER,DEAD,CanisLupus1,Servas\r
3,result,2,0,VILLAGER\r
`;export{e as default};
