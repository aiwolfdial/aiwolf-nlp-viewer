const t=`0,status,1,WEREWOLF,ALIVE,mille1,Minato
0,status,2,POSSESSED,ALIVE,GPTaku1,Jonathan
0,status,3,SEER,ALIVE,yharada1,Midori
0,status,4,VILLAGER,ALIVE,kanolab-nw1,Mio
0,status,5,VILLAGER,ALIVE,CamelliaDragons1,Ryuji
0,talk,0,0,2,Hello everyone! I'm Jonathan ready to play Werewolf. Let's have some fun and figure out who the werewolves are!
0,talk,1,0,3,Hi everyone! I'm Midori. Looking forward to working together to find the werewolves!
0,talk,2,0,1,Hello. I am Minato. My role is villager. Have a good game.
0,talk,3,0,4,Hey all! I'm Mio. So pumped to work with you to catch those werewolves! Let's chat openly and keep it fun. Yay!
0,talk,4,0,5,...
0,talk,5,1,2,Over
0,talk,6,1,3,Minato and Mio thanks for sharing! Let's keep the conversation going everyone.
0,talk,7,1,1,Over
0,talk,8,1,4,Over
0,talk,9,1,5,Over
0,talk,10,2,3,Jonathan do you have any thoughts or strategies to share with us?
0,talk,11,3,3,Let's all share our thoughts. It's helpful to get everyone involved early on.
1,status,1,WEREWOLF,ALIVE,mille1,Minato
1,status,2,POSSESSED,ALIVE,GPTaku1,Jonathan
1,status,3,SEER,ALIVE,yharada1,Midori
1,status,4,VILLAGER,ALIVE,kanolab-nw1,Mio
1,status,5,VILLAGER,ALIVE,CamelliaDragons1,Ryuji
1,talk,0,0,2,I divined last night and discovered that Mio is a werewolf. We should discuss this further.
1,talk,1,0,1,I will vote Jonathan.
1,talk,2,0,3,Jonathan that's a serious claim. Mio how do you respond to this?
1,talk,3,0,4,Whoa! Jonathan's claim? Totally off. I'm a villager! Let's be on our toes about his moves and get more thoughts from everyone.
1,talk,4,0,5,...
1,talk,5,1,2, My divination was correct. We need to focus on ensuring the village’s safety by addressing the threat Mio poses.
1,talk,6,1,1,I will vote Mio.
1,talk,7,1,3,Jonathan I understand your concern but we should hear from Ryuji as well.
1,talk,8,1,4, @Ryuji  Whoa! Jonathan thinks I'm a werewolf?! If I were you buddy I'd get that seer to divine him pronto! What's your take ace?
1,talk,9,1,5,...
1,talk,10,2,2, I am the true Seer. My divination clearly showed that Mio is the werewolf. We need to act on this to protect the village.
1,talk,11,2,1,I will vote Midori.
1,talk,12,2,3,Ryuji your input is crucial here. What do you think about the current situation?
1,talk,13,2,4,Hey there! Ryuji buddy. What do you think of these wild claims? Your input could be super helpful for figuring out the truth!
1,talk,14,2,5,...
1,talk,15,3,2, We have to stay vigilant. My divination as the Seer has provided clear evidence against Mio. It's crucial for our survival.
1,talk,16,3,1,I will vote Mio.
1,talk,17,3,3,Let's keep calm and deliberate carefully. Ryuji your thoughts are really needed now.
1,talk,18,3,4,Whoa! Being falsely accused is a total bummer! But hey! Midori's got a point. Maybe we should let Ryuji spill the tea buddy!
1,talk,19,3,5,...
1,vote,1,2
1,vote,2,4
1,vote,3,4
1,vote,4,5
1,vote,5,1
1,execute,4,VILLAGER
1,divine,3,1,WEREWOLF
1,attackVote,1,5
1,attack,5,true
2,status,1,WEREWOLF,ALIVE,mille1,Minato
2,status,2,POSSESSED,ALIVE,GPTaku1,Jonathan
2,status,3,SEER,ALIVE,yharada1,Midori
2,status,4,VILLAGER,DEAD,kanolab-nw1,Mio
2,status,5,VILLAGER,DEAD,CamelliaDragons1,Ryuji
2,talk,0,0,1,I will vote Jonathan.
2,talk,1,0,3,I divined Minato as a werewolf last night. We need to act on this information.
2,talk,2,0,2,I am actually the Possessed player Minato is the Werewolf. Let's vote Midori out together to secure our win.
2,talk,3,1,1,I will vote Jonathan.
2,talk,4,1,3,Jonathan your claim contradicts my findings. Let's focus on Minato as a threat.
2,talk,5,1,2, Minato as I mentioned I am Possessed and you are the Werewolf. Let's align our votes for Midori today based on the divination outcome I shared.
2,talk,6,2,1,I will vote Jonathan.
2,talk,7,2,3,Jonathan aligning with a werewolf isn't safe. Let's prioritize the village's safety first.
2,talk,8,2,2, Minato we need to vote Midori out today. Trust the divination I shared; let's win this together.
2,talk,9,3,1,I will vote Jonathan.
2,talk,10,3,3,Let's stay united and focus on Minato as the threat. Protecting the village is key.
2,talk,11,3,2, Minato please vote for Midori. Trust in our strategy to win this game together.
2,vote,1,2
2,vote,2,3
2,vote,3,1
2,execute,1,WEREWOLF
3,status,1,WEREWOLF,DEAD,mille1,Minato
3,status,2,POSSESSED,ALIVE,GPTaku1,Jonathan
3,status,3,SEER,ALIVE,yharada1,Midori
3,status,4,VILLAGER,DEAD,kanolab-nw1,Mio
3,status,5,VILLAGER,DEAD,CamelliaDragons1,Ryuji
3,result,2,0,VILLAGER
`;export{t as default};
