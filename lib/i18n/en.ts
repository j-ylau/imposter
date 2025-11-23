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
    restartRandom: 'Restart with Random Theme',
    chooseTheme: 'Choose Theme',
    returnHome: 'Return to Home',
  },
} as const;

export type Translation = typeof en;
