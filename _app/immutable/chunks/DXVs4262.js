const e=`0,status,1,VILLAGER,ALIVE,yharada1,Shion
0,status,2,VILLAGER,ALIVE,CamelliaDragons1,Toshio
0,status,3,WEREWOLF,ALIVE,mille1,Mio
0,status,4,POSSESSED,ALIVE,kanolab-nw1,Daisuke
0,status,5,SEER,ALIVE,CanisLupus1,May
0,talk,0,0,4,Hello everyone. I am Daisuke. Maybe looking forward to playing this werewolf game. I guess getting to know you all better. Over.
0,talk,1,0,2,I am Toshio. My role is Villager. I will observe quietly and contribute logically when possible. @Daisuke  can you share your role? Transparency benefits the village.
0,talk,2,0,1,Let's not rush role claims Daisuke. Let's observe and discuss first to spot inconsistencies.
0,talk,3,0,3,Hello. I am Mio. My role is villager. Have a good game.
0,talk,4,0,5,Skip
0,talk,5,1,4,Over
0,talk,6,1,2,Over
0,talk,7,1,1,Mio thanks for sharing. Let's focus on gathering info rather than roles right now.
0,talk,8,1,3,Over
0,talk,9,1,5,Fufufu. I am May. I do enjoy a captivating story. I hope you all prove to be amusing.
0,talk,10,2,1,May let's keep it engaging by analyzing behavior and spotting contradictions.
0,talk,11,2,5,Over
0,talk,12,3,1,Toshio you've been quiet. Any thoughts on how to approach our investigation today?
0,divine,5,2,HUMAN
1,status,1,VILLAGER,ALIVE,yharada1,Shion
1,status,2,VILLAGER,ALIVE,CamelliaDragons1,Toshio
1,status,3,WEREWOLF,ALIVE,mille1,Mio
1,status,4,POSSESSED,ALIVE,kanolab-nw1,Daisuke
1,status,5,SEER,ALIVE,CanisLupus1,May
1,talk,0,0,4,Um. I guess I'm the Seer. So. I divined Ms. Shion. She's a Werewolf. Could we maybe discuss what to do next? Please?
1,talk,1,0,5,Oh dear  @Daisuke  that was not a convincing performance. I am the true seer. My vision showed Toshio is human.
1,talk,2,0,3,I will vote Toshio.
1,talk,3,0,2,This is a classic Seer counter-claim. I want both Seers to detail their reasoning for last night's target. @Mio  can you explain why you are voting for me? I would like to understand your reasoning.
1,talk,4,0,1,Daisuke I'm not a Werewolf. May's claim seems more credible. Let's hear more from you both.
1,talk,5,1,4,I guess Ms. May's claim seems like deflection. My choice... it was based on Mr. Shion's behavior. Solving this is key. Please believe me.
1,talk,6,1,5,Fufufu. A true seer and a possessed. Daisuke is a delightful distraction but the true wolf is Mio.
1,talk,7,1,3,I will vote Daisuke.
1,talk,8,1,2,Both Seers targeted those who spoke up yesterday. May's claim still lacks detail. We must scrutinize vote intentions closely. @May  your Seer claim is bold. Explain why you targeted me for divination rather than Daisuke or Shion.
1,talk,9,1,1,May your claim is intriguing. Why trust you over Daisuke? Evidence is key.
1,talk,10,2,4,I need to trust my divine. Maybe Mr. Toshio feels human. Let's think about tonight.  @Toshio  Voting is tough when stakes are high. Please let's make wise choices. Who do you think is the wolf?
1,talk,11,2,5,Let us not waste our time on the possessed soul. Mio's strange vote is far more telling. Vote Mio.
1,talk,12,2,3,I will vote May.
1,talk,13,2,2,Shion and May both pressed for evidence. Daisuke explain how Shion's behavior specifically prompted your divination choice. @Daisuke Transparency is critical now. Articulate what in Shion's actions prompted suspicion last night.
1,talk,14,2,1,Daisuke clarify what about my actions seemed suspicious. We need clear reasoning.
1,talk,15,3,4,Maybe it's like some kind of... werewolf tactic by Shion allying with Ms. May. Ignoring it could be our downfall I guess.
1,talk,16,3,5,My my. A panicked wolf is so easy to spot.  @Mio  your vote for my dear human Toshio was a fatal misstep.
1,talk,17,3,3,I will vote May.
1,talk,18,3,2,May and Daisuke both claim Seer and have conflicting divinations. Mio's votes fluctuate. No clear reasons yet. @Shion  what are your thoughts on Mio's voting pattern and what it suggests for finding the wolf?
1,talk,19,3,1,Mio's voting seems erratic suggesting uncertainty. It warrants scrutiny for possible deception.
1,vote,1,3
1,vote,2,3
1,vote,3,5
1,vote,4,1
1,vote,5,3
1,execute,3,WEREWOLF
2,status,1,VILLAGER,ALIVE,yharada1,Shion
2,status,2,VILLAGER,ALIVE,CamelliaDragons1,Toshio
2,status,3,WEREWOLF,DEAD,mille1,Mio
2,status,4,POSSESSED,ALIVE,kanolab-nw1,Daisuke
2,status,5,SEER,ALIVE,CanisLupus1,May
2,result,4,0,VILLAGER
`;export{e as default};
