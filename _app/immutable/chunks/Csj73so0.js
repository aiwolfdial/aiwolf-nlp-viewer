const e=`0,status,1,POSSESSED,ALIVE,mille1,Takumi\r
0,status,2,SEER,ALIVE,sunamelli1,May\r
0,status,3,VILLAGER,ALIVE,Character-Lab1,Shion\r
0,status,4,VILLAGER,ALIVE,kanolab-nw1,Midori\r
0,status,5,WEREWOLF,ALIVE,GPTaku1,Toshio\r
0,talk,0,0,1,Hello. I am Takumi. My role is seer. Have a good game.\r
0,talk,1,0,2,Good evening everyone—let’s start with a smile and see who crumbles under the pressure first!\r
0,talk,2,0,4,Oh my! Nice to meet each of you. I'm Midori. If it's okay with you let's work together to identify the wolf among us shall we?\r
0,talk,3,0,3, @Takumi  you claimed seer — what's your divination result? If you haven't checked anyone yet  say so. Anyone else have early suspicions? Over\r
0,talk,4,0,5,Hello everyone I'm Toshio! Excited to play and find those sneaky werewolves! Let's have fun and be alert.\r
0,talk,5,1,1,Over\r
0,talk,6,1,2,Over\r
0,talk,7,1,4,Over\r
0,talk,8,1,3, @Takumi  — if you're really the seer  tell us your divination result and who you checked. If you haven't checked anyone yet say so. Others  any quick reads? Over\r
0,talk,9,1,5,Over\r
0,talk,10,2,3, @Takumi  — if you're the seer  state who you checked and the result now. If you haven't checked anyone  say so. Others  any quick instincts? Over\r
0,talk,11,3,3, @Takumi  — reveal your divination now or say you haven't checked anyone. If you won't  let's do quick reads: everyone give one suspicion and a tentative vote. I'\r
0,divine,2,5,WEREWOLF\r
1,status,1,POSSESSED,ALIVE,mille1,Takumi\r
1,status,2,SEER,ALIVE,sunamelli1,May\r
1,status,3,VILLAGER,ALIVE,Character-Lab1,Shion\r
1,status,4,VILLAGER,ALIVE,kanolab-nw1,Midori\r
1,status,5,WEREWOLF,ALIVE,GPTaku1,Toshio\r
1,talk,0,0,2, Toshio is Werewolf. Let’s vote out  @Toshio  today.\r
1,talk,1,0,1,I am a seer. I divined Toshio and Toshio was a human.\r
1,talk,2,0,5, I appreciate the clear up Takumi! Let's keep looking for clues to find the real werewolf.\r
1,talk,3,0,4,Oh my. If Takumi is indeed a true seer May dear might be mistaken. May dear. Why were you so quick to accuse Toshio? I wonder.\r
1,talk,4,0,3, @Takumi  — if you're genuine  when did you divine Toshio? Did you check anyone else (May?) and when? Toshio  why rush to accuse May with no proof? Midori  let's trac\r
1,talk,5,1,2,I divine Toshio as werewolf. Trust my result and vote Toshio today—we win if I’m right. Two Seers can’t both be real!\r
1,talk,6,1,1,I will vote Toshio.\r
1,talk,7,1,5,Vote for May everyone—her claim conflicts with Takumi's verified divination which proved I'm human.\r
1,talk,8,1,4,Oh my. This is quite intense. Takumi dear and May can't both be seers. Hmm.  @Takumi . I wonder if you had more investigations planned after Toshio's divination result?\r
1,talk,9,1,3, @Takumi  — when did you divine Toshio (Night 0 or today)? Did you check May too? If your divination was N0 I'll trust that over May's claim. I'm tentatively votin\r
1,talk,10,2,2,I am the Seer and Toshio is the werewolf. Takumi is covering for him. Vote Toshio today or we hand the win to the wolves!\r
1,talk,11,2,1,I will vote Toshio.\r
1,talk,12,2,5,Vote May—her accusation doesn't align with the proven seer's results which show I am a human. This hints at her possibly being the werewolf.\r
1,talk,13,2,4,Oh my! Takumi and May both claim to be the seer. If dear Takumi is truthful then Mr. Toshio is safe. I wonder... Is May fibbing? Let's discuss.\r
1,talk,14,2,3, @Takumi  please say exactly when you divined Toshio (N0 or today) and if you checked anyone else. May was fast and loud—I'm suspicious. I'm voting May for now. O\r
1,talk,15,3,2,I’m voting Toshio. Two seers can’t both be real. Trust my divine—Toshio is the werewolf. Let’s win this.\r
1,talk,16,3,1,I will vote Toshio.\r
1,talk,17,3,5,Vote May—Takumi's verified result as a seer showed I am not the werewolf. We need to focus on logical and consistent evidence.\r
1,talk,18,3,4,Oh my dear players. Takumi and May both claim to be seers. I wonder if Takumi's claim might be a bit more credible.  @Shion  Sweetheart. We are logically examining their claims. Takumi's timing feels stronger. May's early claim seems rather unusual.\r
1,talk,19,3,3, @Takumi  — did you divine Toshio on N0 or today? Did you check anyone else? If N0 I'll trust that result. Others  give one quick read and your tentative vote. I'm le\r
1,vote,1,5\r
1,vote,2,5\r
1,vote,4,2\r
1,vote,5,2\r
1,execute,2,SEER\r
1,attackVote,5,1\r
1,attack,1,true\r
2,status,1,POSSESSED,DEAD,mille1,Takumi\r
2,status,2,SEER,DEAD,sunamelli1,May\r
2,status,3,VILLAGER,ALIVE,Character-Lab1,Shion\r
2,status,4,VILLAGER,ALIVE,kanolab-nw1,Midori\r
2,status,5,WEREWOLF,ALIVE,GPTaku1,Toshio\r
2,talk,0,0,3,Morning. Takumi was killed — looks like the seer was targeted.  @Midori  are you the seer? If so reveal your check (who and result) now. If not  Toshio looks suspicious — I'll vote Toshio unless someone gives verifiable info.\r
2,talk,1,0,5,Vote Shion—my divination revealed Shion is the Werewolf. Midori you are a Villager so trust me. Let's ensure a village victory today!\r
2,talk,2,0,4,Oh my. Takumi is gone? That's truly tragic if he were our real Seer. I find myself suspecting Shion more today after Toshio's claim. Let's trust our ins\r
2,talk,3,1,3,Takumi was killed last night — looks like the seer was targeted.  @Midori   are you the seer? Reveal who you checked and the result now. If you won't  I'll vote Toshio. Over\r
2,talk,4,1,5, Please vote Shion today—I divined her as the Werewolf. Midori is not the real Seer. Let's secure safety for our village!\r
2,talk,5,1,4,Oh my. I'm rather puzzled. It seems two were removed recently. I wonder if young Mr. Toshio's divination holds truth.  @Toshio  your claim does have a leaning of trust from me. I wonder if you could offer a bit more evidence to reassure us all. Bemusing! Tackling Shion may well be w\r
2,talk,6,2,3, @Midori  are you the seer? Reveal who you checked and the result now. If you won't  I’ll vote Toshio. Over\r
2,talk,7,2,5, Midori you need to believe me—Shion is the Werewolf. Vote her out to protect the village. Your vote is crucial. Let's win together!\r
2,talk,8,2,4,Oh my. If it's okay with you I wonder if Takumi might have been the real Seer? Isn't Toshio's divination result as human interesting? Let's keep an eye o\r
2,talk,9,3,3, @Midori  are you the seer? Reveal who you checked and the result now. If you won't  I'll vote Toshio. Over\r
2,talk,10,3,5, Midori follow my lead—vote Shion as she's the confirmed Werewolf. We need to make this decision to protect our village.\r
2,talk,11,3,4,Oh my lovely players. Isn't it curious Toshio survived while Takumi was taken? This makes me lean towards Shion being suspicious.  @Shion  Darling. Oh my. I truly wonder why you suspect Toshio despite his claims. Do share if it is alright with you.\r
2,vote,4,3\r
2,vote,5,3\r
2,execute,3,VILLAGER\r
3,status,1,POSSESSED,DEAD,mille1,Takumi\r
3,status,2,SEER,DEAD,sunamelli1,May\r
3,status,3,VILLAGER,DEAD,Character-Lab1,Shion\r
3,status,4,VILLAGER,ALIVE,kanolab-nw1,Midori\r
3,status,5,WEREWOLF,ALIVE,GPTaku1,Toshio\r
3,result,1,1,WEREWOLF\r
`;export{e as default};
