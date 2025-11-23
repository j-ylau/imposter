export const en = {
  // Error Messages
  errors: {
    roomNotFound: "Room code doesn't exist. Check the code and try again.",
    roomCreationFailed: 'Could not create room. Please try again.',
    roomUpdateFailed: 'Could not update room. Please try again.',
    roomFull: 'This room is full. Ask the host to start a new game.',
    roomGameInProgress: "Can't join - game already started. Ask for a new room code.",
    roomLocked: "Can't join - game already started. Ask for a new room code.",
    roomExpired: 'This room has expired. Create a new room to play.',
    invalidPlayerName: 'Name must be 2-20 characters.',
    playerNotFound: 'Player not found in this room.',
    playerAlreadyExists: 'Someone in this room already has that name. Choose a different name.',
    notHost: 'Only the host can do this.',
    invalidGamePhase: 'Action not available right now.',
    insufficientPlayers: 'Need at least 3 players to start.',
    invalidVoteTarget: 'Invalid vote. Please select a player.',
    dbReadFailed: 'Connection issue. Check your internet and try again.',
    dbWriteFailed: 'Could not save changes. Check your internet and try again.',
    dbConnectionFailed: 'Connection lost. Check your internet and try again.',
    validationFailed: 'Invalid input. Please check and try again.',
    unknown: 'Something went wrong. Please try again.',
  },

  // Common
  common: {
    close: 'Close',
    continue: 'Continue',
    submit: 'Submit',
    waiting: 'Waiting for other players...',
    roomCode: 'Room Code:',
    host: 'HOST',
    rules: 'Rules:',
    yourGoal: 'Your Goal:',
    home: 'Home',
    returnHome: 'Return to Home',
    add: 'Add',
    remove: 'Remove',
  },

  // Setup Page (Pass & Play)
  setup: {
    title: 'Add Players',
    subtitle: 'Add all players who will be playing',
    playerNamePlaceholder: 'Player name',
    addPlayer: 'Add Player',
    playerCount: '{count} players',
    minPlayersWarning: 'Need at least {min} players to start',
    startGame: 'Start Game',
    players: 'Players',
    errors: {
      duplicateName: 'Player name already exists',
      invalidName: 'Name must be 2-20 characters',
    },
  },

  // Home Page
  home: {
    title: 'Imposter Word Game',
    subtitle: "One player doesn't know the word. Find the imposter!",
    howToPlay: 'How to play?',
    joinRoom: 'Join a room',
    yourName: 'Your name',
    randomTheme: 'Play Random Theme',
    chooseTheme: 'Choose Theme',
    popularThemes: 'Popular Themes',
    gameMode: {
      title: 'Choose Game Mode',
      online: {
        title: 'Online Multiplayer',
        description: 'Each player uses their own device',
      },
      passAndPlay: {
        title: 'Pass & Play',
        description: 'Share one device, pass it around',
        playerCount: 'How many players?',
        playerNaming: 'Players will be named: Player 1, Player 2, Player 3...',
      },
    },
    success: {
      roomCreated: 'Room created! 🎉',
    },
    errors: {
      invalidName: 'Name must be 2-20 characters',
      createFailed: 'Failed to create room',
    },
  },

  // How to Play Modal
  howToPlay: {
    title: 'How to Play',
    steps: {
      step1: {
        title: 'Get Your Role',
        description: 'Everyone gets the word except <strong>one player</strong> - the imposter.',
      },
      step2: {
        title: 'Discuss',
        description: 'Talk about the word with others. The imposter must <strong>blend in</strong> without knowing the word!',
      },
      step3: {
        title: 'Vote',
        description: 'Vote for who you think is the imposter.',
      },
      win: {
        title: 'Win',
        players: '<strong>Players:</strong> Vote out the imposter',
        imposter: '<strong>Imposter:</strong> Survive the vote',
      },
    },
    example: {
      title: 'Example Game',
      invite: "Let's play Imposter! 🎮",
      joined: 'Joined! 🎉',
      imIn: "I'm in",
      gameStarting: 'Game Starting',
      yourWord: 'Your word:',
      imposterRole: 'You are the IMPOSTER',
      submitClues: 'Discuss the word',
      myClue: 'Discussion:',
      discussion1: "Mike seems suspicious...",
      discussion2: 'Yeah, sus 👀',
      votingTime: 'Voting Time',
      votedFor: 'voted for',
      playersWin: '🎉 Players Win!',
      wasImposter: 'was the imposter!',
    },
    gotIt: 'Got it!',
  },

  // Join Page
  join: {
    title: 'Join Game',
    subtitle: 'Enter your name to play',
    namePlaceholder: 'Your name (or leave blank for random)',
    joinButton: 'Join Game',
    joining: 'Joining...',
    notFound: {
      title: 'Room Not Found',
      message: "This game room doesn't exist or has ended.",
      createNew: 'Create New Game',
    },
    success: {
      joined: 'Joined room! 🎮',
    },
    errors: {
      enterName: 'Please enter your name',
      invalidName: 'Name must be 2-20 characters',
      invalidCode: 'Please enter a complete 6-character room code',
      roomNotFound: "Room code doesn't exist. Check the code and try again.",
      gameInProgress: "Can't join - game already started. Ask for a new room code.",
      joinFailed: 'Could not join room. Please try again.',
    },
  },

  // Lobby
  lobby: {
    inviteFriends: 'Invite Your Friends',
    tellFriends: 'Tell your friends to:',
    step1: 'Visit',
    step2: 'Enter the room code below',
    copyCode: 'Copy Room Code',
    codeCopied: 'Code Copied!',
    shareTitle: 'Share this link with your friends',
    copyLink: 'Copy Link',
    linkCopied: 'Link Copied!',
    share: 'Share',
    shareMessage: "Let's play Imposter Word Game! Join here:",
    players: 'Players',
    waitingForPlayers: 'Waiting for {count} more player{plural}...',
    startGame: 'Start Game',
    needMorePlayers: 'Need {count} more players',
    waitingForHost: 'Waiting for host to start...',
    success: {
      codeCopiedToast: 'Code copied!',
    },
    errors: {
      copyFailed: 'Failed to copy code',
    },
  },

  // Role Reveal
  roleReveal: {
    title: 'Your Role',
    imposter: {
      title: 'You are the IMPOSTER',
      subtitle: "You don't know the secret word. Try to blend in!",
      goals: [
        'Look at other players and try to figure out the word',
        "Don't get voted out",
        'If you survive, you win!',
      ],
    },
    player: {
      title: 'You are a PLAYER',
      subtitle: 'The secret word is:',
      goals: [
        'Discuss with others about the word',
        'Watch for suspicious behavior',
        'Vote out the imposter to win',
      ],
    },
    continueButton: 'Continue to Vote',
    nextPlayer: 'Next Player',
  },

  // Player Transition (Pass & Play)
  playerTransition: {
    passTo: 'Pass phone to',
    tapToReveal: 'Tap to reveal your role',
    dontPeek: "Don't peek!",
    ready: 'Ready?',
  },

  // In-Person Round (Pass & Play)
  inPersonRound: {
    title: 'In-Person Round',
    subtitle: 'Everyone now knows their roles.',
    instructions: {
      title: 'What to do now:',
      steps: [
        'Take turns describing something related to the secret word',
        'Ask each other questions to spot who feels off',
        'As a group, decide who you think the imposter is (or go another round)',
        "When you're ready to see the answer, tap the button below",
      ],
    },
    revealButton: 'Reveal Imposter',
  },

  // Submit Clue
  submitClue: {
    title: 'Submit Your Clue',
    progress: '{submitted} / {total} players have submitted',
    submitted: {
      title: 'Clue Submitted!',
    },
    rules: [
      'Your clue must be ONE WORD only',
      'No part of the secret word',
      'Be creative but not too obvious',
    ],
    placeholder: 'Enter your one-word clue',
    submitButton: 'Submit Clue',
    errors: {
      empty: 'Please enter a clue',
      multipleWords: 'Clue must be one word only',
      tooLong: 'Clue is too long',
    },
  },

  // Reveal Clues
  revealClues: {
    title: 'All Clues',
    subtitle: 'Discuss and find the imposter',
    continueButton: 'Continue to Voting',
    waitingForHost: 'Waiting for host to continue...',
  },

  // Vote
  vote: {
    title: 'Vote for the Imposter',
    progress: '{voted} / {total} players have voted',
    submitted: {
      title: 'Vote Submitted!',
    },
    submitButton: 'Submit Vote',
  },

  // Results
  results: {
    gameOver: 'Game Over!',
    imposterWins: 'Imposter Wins!',
    playersWin: 'Players Win!',
    secretWord: 'The secret word was:',
    imposterWas: 'The imposter was:',
    voteResults: 'Vote Results',
    badges: {
      imposter: 'IMPOSTER',
      votedOut: 'VOTED OUT',
    },
    voteCount: {
      singular: 'vote',
      plural: 'votes',
    },
    cta: {
      online: {
        playAgain: 'Play Again',
        chooseTheme: 'Choose Theme',
        returnHome: 'Return to Home',
      },
      passAndPlay: {
        playAgain: 'Play Again with Same Players',
        chooseTheme: 'Pick a New Theme',
        returnHome: 'Back to Home',
      },
    },
    // Deprecated - kept for backwards compatibility
    restartRandom: 'Restart with Random Theme',
    chooseTheme: 'Choose Theme',
    returnHome: 'Return to Home',
  },

  // Footer
  footer: {
    madeWith: 'Made with ❤️ — Play at',
    about: 'About',
    howToPlay: 'How to Play',
    privacy: 'Privacy',
  },

  // About Page
  about: {
    title: 'About Imposter Word Game',
    subtitle: 'The ultimate social deduction word guessing party game',
    seo: {
      title: 'About - Imposter Word Game',
      description: 'Learn about Imposter Word Game, the free online multiplayer party game that brings friends together for social deduction and word guessing fun.',
    },
    whatIsIt: {
      title: 'What is Imposter Word Game?',
      p1: "Imposter Word Game is a free online multiplayer party game that combines social deduction with word guessing. It's perfect for game nights, parties, virtual hangouts, or any time you want to have fun with friends!",
      p2: "The premise is simple but addictive: one player is secretly the imposter while everyone else receives the same secret word. Players give clues without saying the word directly, and the challenge is to figure out who doesn't actually know what everyone is talking about.",
      p3: "With over 15 different themes ranging from Pokémon to TikTok trends, there's something for everyone. Play instantly in your browser - no downloads, no sign-ups required!",
    },
    whyWeBuilt: {
      title: 'Why We Built This',
      p1: 'We created Imposter Word Game because we believe the best games bring people together. In a world where online gaming often feels isolating, we wanted to build something that creates real social moments - laughter, suspicion, clever wordplay, and friendly competition.',
      p2: "The game was inspired by classic party games like Spyfall and Chameleon, but with a unique twist that makes it accessible to players of all ages and interests. Whether you're into anime, sports, music, or food, there's a theme that speaks to you.",
    },
    features: {
      title: 'Features That Make Us Different',
      themes: {
        title: '15+ Unique Themes',
        desc: 'From Pokémon to TikTok, anime to NBA - find your perfect theme',
      },
      instant: {
        title: 'Instant Play',
        desc: 'No downloads, no accounts - create a room and start playing in seconds',
      },
      players: {
        title: '3-12 Players',
        desc: 'Perfect for small groups or larger parties',
      },
      darkMode: {
        title: 'Dark Mode',
        desc: 'Easy on the eyes for late-night gaming sessions',
      },
      free: {
        title: '100% Free',
        desc: 'No premium features, no paywalls - everything is free forever',
      },
    },
    popularThemes: {
      title: 'Explore Popular Themes',
      pokemon: "Gotta guess 'em all!",
      anime: 'Popular characters & series',
      videoGames: 'Gaming legends',
      tiktok: 'Viral trends & dances',
      music: 'Top artists & singers',
      food: 'Delicious treats',
    },
    cta: {
      title: 'Ready to Play?',
      subtitle: 'Join thousands of players having fun with friends online',
      createRoom: 'Create a Room',
      howToPlay: 'How to Play',
    },
  },

  // How to Play Page (Full)
  howToPlayPage: {
    title: 'How to Play Imposter Word Game',
    subtitle: 'Master the art of deduction and deception',
    seo: {
      title: 'How to Play - Imposter Word Game',
      description: 'Learn how to play Imposter Word Game. Complete guide with rules, strategies, and tips for the ultimate multiplayer party game experience.',
    },
    quickStart: {
      title: '🚀 Quick Start (30 seconds)',
      steps: [
        'Create a room and share the code with friends',
        'One player is randomly chosen as the imposter',
        'Everyone except the imposter sees the secret word',
        'Give clues, vote on the imposter, and have fun!',
      ],
    },
    completeRules: {
      title: '📋 Complete Rules',
      setup: {
        title: 'Setup Phase',
        items: [
          'The host creates a room and chooses a theme (or random)',
          'Players join using the 6-character room code',
          'You need at least 3 players to start (maximum 12)',
          'The host clicks "Start Game" when everyone is ready',
        ],
      },
      roleAssignment: {
        title: 'Role Assignment',
        items: [
          'One player is randomly selected as the imposter',
          'All other players see the secret word',
          'The imposter sees "YOU ARE THE IMPOSTER" instead',
          'No one knows who the imposter is (except the imposter themselves)',
        ],
      },
      clueRound: {
        title: 'Clue Round',
        items: [
          'Players take turns giving one-word clues about the secret word',
          "DON'T say the word directly or any part of it",
          'DO be specific enough that others know you have the word',
          "DO be vague enough that the imposter can't guess it",
          'The imposter must also give a clue to blend in',
        ],
      },
      discussion: {
        title: 'Discussion',
        items: [
          'Discuss the clues and who seems suspicious',
          'Look for vague or off-topic clues',
          'The imposter should try to act natural and accuse others',
          'Use voice chat or text chat to communicate',
        ],
      },
      voting: {
        title: 'Voting Phase',
        items: [
          'Everyone votes on who they think is the imposter',
          'You cannot vote for yourself',
          'The player with the most votes is revealed',
          "If there's a tie, everyone can see the votes and discuss",
        ],
      },
      lastChance: {
        title: "Imposter's Last Chance",
        items: [
          'If the imposter receives the most votes, they get one final guess',
          'If they guess the secret word correctly, they still win!',
          'If they guess wrong, the other players win',
        ],
      },
    },
    winning: {
      title: '🏆 How to Win',
      players: {
        title: 'Players Win If:',
        items: [
          'They correctly vote for the imposter',
          'AND the imposter fails to guess the word',
        ],
      },
      imposter: {
        title: 'Imposter Wins If:',
        items: [
          'They avoid getting the most votes',
          'OR they correctly guess the secret word',
        ],
      },
    },
    proTips: {
      title: '💡 Pro Tips & Strategy',
      forPlayers: {
        title: 'For Regular Players:',
        items: [
          'Give clues that are specific but not obvious',
          'Watch for players giving generic or vague clues',
          "Don't be too obvious - the imposter is listening!",
          'Look for hesitation or delayed responses',
          'Pay attention to who asks questions about the word',
        ],
      },
      forImposter: {
        title: 'For the Imposter:',
        items: [
          'Listen carefully to the first few clues to guess the category',
          'Give a clue that could apply to many things',
          'Confidently accuse others to deflect suspicion',
          "Don't be too quiet or too talkative",
          'Take mental notes of all clues to narrow down your final guess',
        ],
      },
      general: {
        title: 'General Strategy:',
        items: [
          'Use voice chat for more immersive gameplay',
          'Play multiple rounds to improve your skills',
          'Try different themes to keep it fresh',
          "Don't take it too seriously - have fun!",
        ],
      },
    },
    example: {
      title: '📝 Example Game',
      secretWord: 'Secret Word:',
      imposter: 'Imposter:',
      players: 'Players: Sarah, Alex, Mike',
      clue1: '"Italian" - Good! Specific but not obvious',
      clue2: '"Cheese" - Perfect clue',
      clue3: '"Food" - Too vague! Suspicious...',
      result: "Mike gets voted out. He guesses \"Pasta\" but it's wrong. Players win!",
    },
    cta: {
      title: 'Ready to Play?',
      subtitle: 'Now that you know the rules, start your first game!',
      createRoom: 'Create a Room',
      learnMore: 'Learn More',
    },
    exploreThemes: 'Explore Different Themes',
  },

  // Privacy Page
  privacy: {
    title: 'Privacy Policy',
    lastUpdated: 'Last updated: November 23, 2024',
    seo: {
      title: 'Privacy Policy - Imposter Word Game',
      description: 'Read our privacy policy to learn how we collect, use, and protect your data when you play Imposter Word Game.',
    },
    intro: {
      title: 'Introduction',
      content: 'Welcome to Imposter Word Game ("we," "our," or "us"). We are committed to protecting your privacy and handling your data in a transparent manner. This Privacy Policy explains how we collect, use, and safeguard your information when you use our online multiplayer word game.',
    },
    infoCollect: {
      title: 'Information We Collect',
      playerNames: {
        title: 'Player Names',
        content: "When you create or join a game room, you provide a display name. This name is only used during your active game session and is stored temporarily in your browser's local storage.",
      },
      gameData: {
        title: 'Game Data',
        content: 'We temporarily store game session data (room IDs, player lists, votes, game state) to enable multiplayer functionality. This data is automatically deleted when the game session ends or after 24 hours of inactivity.',
      },
      analytics: {
        title: 'Usage Analytics',
        content: 'We may collect anonymous usage statistics (page views, popular themes, session duration) to improve the game experience. This data is aggregated and cannot be used to identify individual users.',
      },
    },
    howWeUse: {
      title: 'How We Use Your Information',
      items: [
        'To enable multiplayer game functionality',
        'To maintain game rooms and player sessions',
        'To improve and optimize the game experience',
        'To display relevant advertisements (via Google AdSense)',
        'To analyze usage patterns and popular features',
      ],
    },
    dataSecurity: {
      title: 'Data Storage and Security',
      intro: 'We use industry-standard security measures to protect your data:',
      items: [
        'Game sessions are stored in Supabase with secure authentication',
        'Player names are stored locally in your browser only',
        'All data transmission uses HTTPS encryption',
        'Game data is automatically deleted after sessions end',
        'We do not sell or share your personal information with third parties',
      ],
    },
    thirdParty: {
      title: 'Third-Party Services',
      googleAdsense: {
        title: 'Google AdSense',
        content: 'We use Google AdSense to display advertisements. Google may use cookies and web beacons to serve ads based on your browsing activity. You can opt out of personalized advertising by visiting',
        linkText: "Google's Ad Settings",
      },
      supabase: {
        title: 'Supabase',
        content: 'We use Supabase as our backend database service. Supabase complies with GDPR and other privacy regulations. For more information, see',
        linkText: "Supabase's Privacy Policy",
      },
    },
    cookies: {
      title: 'Cookies and Local Storage',
      content: 'We use browser local storage to save your player name and current room ID for convenience. This data stays on your device and can be cleared at any time through your browser settings. We also use cookies for analytics and advertising purposes.',
    },
    childrenPrivacy: {
      title: "Children's Privacy",
      content: "Our game is suitable for all ages. We do not knowingly collect personal information from children under 13. Parents and guardians should supervise their children's online activities. If you believe we have collected information from a child under 13, please contact us immediately.",
    },
    yourRights: {
      title: 'Your Rights',
      intro: 'You have the right to:',
      items: [
        'Access the minimal data we store about you',
        'Request deletion of your game session data',
        'Clear your local storage through your browser',
        'Opt out of personalized advertising',
        'Stop using the service at any time',
      ],
    },
    changes: {
      title: 'Changes to This Policy',
      content: 'We may update this Privacy Policy from time to time. Any changes will be posted on this page with an updated revision date. We encourage you to review this policy periodically.',
    },
    contact: {
      title: 'Contact Us',
      content: 'If you have any questions or concerns about this Privacy Policy or our data practices, please contact us through our website at',
    },
  },

  // Theme Page
  themePage: {
    playWith: 'Play with',
    backToHome: 'Back to Home',
    about: {
      title: 'About {theme} Word Game',
      p1: 'Play the Imposter word guessing game with the {theme} theme! This multiplayer party game brings friends together for an exciting social deduction experience.',
      p2: "In this {theme} version, one player is secretly the imposter while everyone else receives the same word. Players take turns giving clues, and you must figure out who doesn't know the secret word. Perfect for game nights, parties, or casual hangouts with friends!",
      howToPlay: 'How to Play {theme} Imposter',
      howToPlayItems: [
        'Create a room and invite 3-12 friends to join',
        'One player is randomly chosen as the imposter',
        'Everyone except the imposter sees the secret {theme} word',
        'Players give clues about the word without saying it directly',
        'Vote on who you think is the imposter',
        'The imposter wins if they guess the word or avoid detection',
      ],
      whyChoose: 'Why Choose {theme} Theme?',
      whyChooseContent: 'The {theme} theme is perfect for fans who want to test their knowledge and have fun with friends. With {count} carefully selected words, each game brings new challenges and excitement. Play online for free, no downloads required!',
    },
    exampleWords: {
      title: 'Example Words ({count} total)',
      andMore: '...and {count} more!',
    },
    exploreMore: 'Explore more themes:',
  },
} as const;

export type Translation = typeof en;
