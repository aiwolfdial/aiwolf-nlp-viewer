const e=`0,status,1,WEREWOLF,ALIVE,yharada1,Rin\r
0,status,2,POSSESSED,ALIVE,Character-Lab1,Mizuki\r
0,status,3,SEER,ALIVE,GPTaku1,Misaki\r
0,status,4,VILLAGER,ALIVE,sunamelli1,Shizue\r
0,status,5,VILLAGER,ALIVE,mille1,Shunichi\r
0,talk,0,0,5,Hello. I am Shunichi. My role is villager. Have a good game.\r
0,talk,1,0,4,Hello everyone I hope today’s game brings out your gentlest side. Let’s enjoy this together and keep spirits high.\r
0,talk,2,0,2,Morning. Day 0 — let's get concrete. Power roles  state exact who/when/result if you have one.  @Misaki  are you claiming seer? If so say when you'll divinate and how you'll report results. Shunichi's villager claim is noted but gives us nothing useful. I\r
0,talk,3,0,3,Hello everyone! I'm Misaki ready to play Werewolf. Excited to join you all and see who survives till the end!\r
0,talk,4,0,1,Hi everyone! I'm Rin! Let's have fun and see who can outsmart the wolves! :)\r
0,talk,5,1,5,Over\r
0,talk,6,1,4,Over\r
0,talk,7,1,2,Still no concrete power claims. I'm against a random lynch Day 0 — we need facts. If you have a power role  state exact who/when/result.  @Misaki  if you're the seer  say when you'll divinate and how you'll report results. Let's collect info before any votes. Over\r
0,talk,8,1,3,Over\r
0,talk,9,1,1,Let's stay positive and share thoughts! Any hunches on who might be suspicious?\r
0,talk,10,2,2,No solid hunches yet — I'm prioritizing facts over feelings.  @Misaki   one more time: if you're the seer  say exactly when and how you'll divinate. I'm against a random Day 0 lynch. Over\r
0,talk,11,2,1,I agree facts are important! Let's gather info and see if anyone stands out.\r
0,talk,12,3,2,Still no concrete claims.  @Misaki  — if you're the seer  state exactly who/when/result and whether you'll announce publicly. Silence or vagueness only raises suspicion. I'm against a\r
0,talk,13,3,1,Let's stay patient and hope Misaki or someone shares soon. It's early so let's keep calm!\r
0,divine,3,4,HUMAN\r
1,status,1,WEREWOLF,ALIVE,yharada1,Rin\r
1,status,2,POSSESSED,ALIVE,Character-Lab1,Mizuki\r
1,status,3,SEER,ALIVE,GPTaku1,Misaki\r
1,status,4,VILLAGER,ALIVE,sunamelli1,Shizue\r
1,status,5,VILLAGER,ALIVE,mille1,Shunichi\r
1,talk,0,0,1,Good morning! Any new insights or discoveries from last night to share?\r
1,talk,1,0,3, As the seer I divined Shizue last night. The result is that Shizue is Human. Let's use this info moving forward.\r
1,talk,2,0,4,Misaki claims Seer and divined me Human. @Shunichi  @Rin  please share your thoughts or role stance so we can move forward.\r
1,talk,3,0,2,Misaki claimed seer and says Shizue is Human — that's useful but I need specifics. Misaki  which night did you divinate and why reveal this now? Vague ti @Shunichi  you said villager — why should we trust that? Any concrete observations or reasons? I'm against hasty lynches; let's get clear info first. Over\r
1,talk,4,0,5,I will vote Misaki.\r
1,talk,5,1,1,Thanks for the info Misaki! Shunichi why vote for Misaki? Any reasons we should consider?\r
1,talk,6,1,3,Let's consider voting for Mizuki for exile today based on suspicious behavior.\r
1,talk,7,1,4, @Shunichi  can you explain your vote for Misaki even with her Seer CO and her divining me Human? It feels sudden.\r
1,talk,8,1,2, @Shunichi  please explain your vote for Misaki — when did you decide and what concrete reads or actions make you suspect her despite her seer CO? Misaki  also state\r
1,talk,9,1,5,Over\r
1,talk,10,2,1,Maybe we should wait for Shunichi's explanation before deciding on a vote.\r
1,talk,11,2,3, Mizuki has shown a markedly different strategy from prior games focusing heavily on demanding concrete proofs while contributing none. Vote Mizuk\r
1,talk,12,2,4, @Shunichi  your vote for Misaki is sudden. Why target the Seer who gave human? Is there a reason you doubt her claim?\r
1,talk,13,2,2,We need hard info before any vote.  @Shunichi  why did you vote for Misaki — give concrete reasons and timing. Misaki  if you're the seer  state exactly which night you divined Shizue and why you're re\r
1,talk,14,3,1,Let's focus on getting more info from Shunichi and discuss Misaki's claim carefully.\r
1,talk,15,3,3,I divined Shizue on the first night confirming her as Human to help guide our early game decisions. Mizuki's pressure and doubt cast shadows on their m\r
1,talk,16,3,4,Of all moves today Shunichi’s bite out on the Seer stands out as most dangerous. I am voting Shunichi.\r
1,talk,17,3,2, @Shunichi  you still haven't explained why you voted for Misaki. When did you decide and what concrete reads or actions made you suspect her despite her seer CO an\r
1,vote,1,4\r
1,vote,3,2\r
1,vote,4,5\r
1,vote,5,3\r
1,execute,5,VILLAGER\r
1,divine,3,2,HUMAN\r
1,attackVote,1,2\r
1,attack,2,true\r
2,status,1,WEREWOLF,ALIVE,yharada1,Rin\r
2,status,2,POSSESSED,DEAD,Character-Lab1,Mizuki\r
2,status,3,SEER,ALIVE,GPTaku1,Misaki\r
2,status,4,VILLAGER,ALIVE,sunamelli1,Shizue\r
2,status,5,VILLAGER,DEAD,mille1,Shunichi\r
2,talk,0,0,4, @Misaki  please share your divination result now so we can focus on finding the wolf before we vote\r
2,talk,1,0,1,Good morning! Misaki any new divination results to help us today?\r
2,talk,2,0,3,Shizue please vote for Rin. I divined Rin as a Werewolf last night which is crucial for our survival. Let's secure the village.\r
2,talk,3,1,4, @Rin  you’re accused as wolf. If you’re not  speak up now—are you a Seer or Villager? Why silent?\r
2,talk,4,1,1,I'm just a Villager! Misaki might be misleading us. Let's think carefully!\r
2,talk,5,1,3, Shizue I am certain Rin is the Werewolf. As Seer on the first night I divined Shizue as Human. Given Rin's eagerness to disprove without evidence it sup\r
2,talk,6,2,4, @Rin  since Misaki CO’d Seer and no one countered I believe her result. Why should I doubt Misaki’s claim?\r
2,talk,7,2,1,Misaki could be lying to mislead us. Trust your instincts Shizue!\r
2,talk,8,2,3,Shizue trust my seer insight. I have no reason to deceive. Rin reacted defensively when exposed supporting a werewolf's typical response.\r
2,talk,9,3,4,I’ll trust the Seer’s vision and vote  @Rin . No counter-CO came. This is safest for the village. Let’s end the threat here.\r
2,talk,10,3,1,I understand Shizue. Let's hope this decision brings peace to the village.\r
2,talk,11,3,3,  Shizue made the right choice based on the facts available. Let’s hope we can now protect the village together.\r
2,vote,1,3\r
2,vote,3,1\r
2,vote,4,1\r
2,execute,1,WEREWOLF\r
3,status,1,WEREWOLF,DEAD,yharada1,Rin\r
3,status,2,POSSESSED,DEAD,Character-Lab1,Mizuki\r
3,status,3,SEER,ALIVE,GPTaku1,Misaki\r
3,status,4,VILLAGER,ALIVE,sunamelli1,Shizue\r
3,status,5,VILLAGER,DEAD,mille1,Shunichi\r
3,result,2,0,VILLAGER\r
`;export{e as default};
