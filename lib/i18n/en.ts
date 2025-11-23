export const en = {
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
    yourName: 'Your name',
    randomTheme: 'Play Random Theme',
    chooseTheme: 'Choose Theme',
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
        description: 'Everyone gets the word except <strong>one player</strong>.',
      },
      step2: {
        title: 'Give One-Word Clues',
        description: 'Submit <strong>one word</strong> related to the secret word.',
      },
      step3: {
        title: 'Vote',
        description: 'Discuss and vote for the imposter.',
      },
      win: {
        title: 'Win',
        players: '<strong>Players:</strong> Vote out imposter',
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
      submitClues: 'Submit Clues',
      myClue: 'My clue:',
      discussion1: "Mike's clue was too vague...",
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
    errors: {
      roomNotFound: 'Room not found',
      gameInProgress: 'Game already in progress',
      invalidName: 'Name must be 2-20 characters',
      joinFailed: 'Failed to join room',
    },
  },

  // Lobby
  lobby: {
    shareTitle: 'Share this link with your friends',
    copyLink: 'Copy Link',
    linkCopied: 'Link Copied!',
    share: 'Share',
    whatsapp: 'WhatsApp',
    text: 'Text',
    shareMessage: "Let's play Imposter Word Game! Join here:",
    players: 'Players',
    waitingForPlayers: 'Waiting for {count} more player{plural}...',
    startGame: 'Start Game',
    needMorePlayers: 'Need {count} more players',
    waitingForHost: 'Waiting for host to start...',
  },

  // Role Reveal
  roleReveal: {
    title: 'Your Role',
    imposter: {
      title: 'You are the IMPOSTER',
      subtitle: "You don't know the secret word. Try to blend in with your clues!",
      goals: [
        'Give vague clues that could apply to anything',
        "Don't get voted out",
        'If you survive, guess the secret word to win',
      ],
    },
    player: {
      title: 'You are a PLAYER',
      subtitle: 'The secret word is:',
      goals: [
        'Give a one-word clue related to the secret word',
        'Help others identify the imposter',
        'Vote out the imposter to win',
      ],
    },
    continueButton: 'Continue to Clue Round',
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
    playAgain: 'Play Again',
  },
} as const;

export type Translation = typeof en;
