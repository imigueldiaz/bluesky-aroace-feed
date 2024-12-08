# Bluesky Aroace Feed 🌈

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
![Node.js](https://img.shields.io/badge/node.js-%3E=22.0.0-green.svg)
[![Maintenance](https://img.shields.io/badge/Maintained%3F-yes-green.svg)](https://github.com/imigu/bluesky-aroace-feed/graphs/commit-activity)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript&logoColor=white)
![Vitest](https://img.shields.io/badge/Vitest-6E9F18?style=flat&logo=vitest&logoColor=white)
![AT Protocol](https://img.shields.io/badge/AT_Protocol-00A0F0?style=flat&logo=atproto&logoColor=white)
![Bluesky](https://img.shields.io/badge/Bluesky-0085FF?style=flat&logo=bluesky&logoColor=white)

> [!CAUTION]
> The test files in this project contain examples of hate speech, discriminatory language, and other potentially triggering content that are used to validate the content filtering system. These examples are necessary for testing purposes but may be distressing to read. Please exercise caution when reviewing the test files.

A specialized feed generator for the Bluesky social network that curates content related to the aromantic and asexual (aroace) community. This project aims to create a safe and inclusive space for aroace individuals to connect and share their experiences.

## 🌟 Features

- Multi-language support (English, Spanish, French, German)
- Context-aware content filtering:
  - Detects and includes positive discussions about ace/aro identity
  - Filters out gaming-related "ace" mentions
  - Handles mixed contexts appropriately
- Advanced language detection using NLP (Natural Language Processing)
- Spam and commercial content filtering
- Hate speech and negative content detection
- Support for Bluesky's native language tags
- Curated feed of aroace-related content on Bluesky
- Custom filtering and content moderation
- Real-time feed updates
- Community-driven content discovery

## 🚀 Getting Started

### Prerequisites

- Node.js 22.0.0 or higher
- A Bluesky account
- API credentials for Bluesky

### Installation

1. Clone the repository

```bash
git clone https://github.com/imigu/bluesky-aroace-feed.git
cd bluesky-aroace-feed
```

2. Install dependencies

```bash
npm install
```

3. Configure your environment variables

```bash
cp .env.example .env
# Edit .env with your Bluesky credentials
```

## 🔧 Configuration

1. Create a `.env` file with your Bluesky credentials:
```env
BSKY_HANDLE=your-handle.bsky.social
BSKY_APP_PASSWORD=your-app-password
```

2. Configure the feed settings in `config.js` if needed

## 🚀 Running the Feed

Start the feed generator:

```bash
npm start
```

For development with auto-reload:

```bash
npm run dev
```

## 🧪 Testing

Run the test suite:

```bash
npm test
```

For test coverage:

```bash
npm run test:coverage
```

Note: The test suite contains examples of hate speech and discriminatory language used to validate the content filtering system. These examples are necessary for testing purposes but may be distressing to read.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 🙏 Acknowledgments

Special thanks to:
- [Compromise](https://github.com/spencermountain/compromise) (@spencermountain) for their incredible NLP library that powers our language detection and text analysis
- The Bluesky team for their open protocol and support
- The aroace community for their feedback and support

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Contact

Project Link: [https://github.com/imigu/bluesky-aroace-feed](https://github.com/imigu/bluesky-aroace-feed)

---

Made with ❤️ for the aroace community
