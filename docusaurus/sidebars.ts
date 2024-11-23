import type { SidebarsConfig } from '@docusaurus/plugin-content-docs';

/**
 * Creating a sidebar enables you to:
 - create an ordered group of docs
 - render a sidebar for each doc of that group
 - provide next/previous navigation

 The sidebars can be generated from the filesystem, or explicitly defined here.

 Create as many sidebars as you want.
 */
const sidebars: SidebarsConfig = {
  // By default, Docusaurus generates a sidebar from the docs folder structure
  // tutorialSidebar: [{type: 'autogenerated', dirName: '.'}],

  tutorialSidebar: [
    {
      type: 'doc',
      id: 'intro',
      label: '👋 Introduction',
    },
    {
      type: 'doc',
      id: 'supported-chains',
      label: '⛓️ Support Chains',
    },
    {
      type: 'category',
      label: '💡 Solide IDEs',
      collapsible: true,
      items: [
        {
          type: 'category',
          label: '🟣 Solide',
          items: [
            {
              type: 'doc',
              id: 'ide/sol-ide-contract',
              label: 'Import Contract Address',
            },
            {
              type: 'doc',
              id: 'ide/sol-ide-github',
              label: 'Import Github Repository',
            },
          ]
        },
        {
          type: 'doc',
          id: 'ide/move-ide',
          label: '🟡 Movide',
        },
        {
          type: 'doc',
          id: 'ide/sway-ide',
          label: '🟢 Swayide',
        },
        {
          type: 'doc',
          id: 'ide/stylus-ide',
          label: '🔵 Stylide',
        },
        {
          type: 'doc',
          id: 'ide/aspect-ide',
          label: '🔵 Aspectide (Coming Soon)',
        },
      ],
    },
    {
      type: 'category',
      label: '🎓 Proof of Learn',
      collapsible: true,
      items: [
        {
          type: 'doc',
          id: 'pol/intro',
          label: 'Introducation',
        },
        {
          type: 'doc',
          id: 'pol/poap',
          label: 'PoL POAP',
        },
        {
          type: 'category',
          label: 'Course',
          items: [
            {
              type: 'doc',
              id: 'pol/course/config',
              label: 'quest.config.json',
            },
            {
              type: 'doc',
              id: 'pol/course/poap',
              label: 'Course POAP',
            },
            {
              type: 'doc',
              id: 'pol/course/apply',
              label: 'Publish on PoL',
            },
          ]
        },
        {
          type: 'category',
          label: 'Quest',
          collapsible: true,
          items: [
            {
              type: 'doc',
              id: 'pol/quest/deployment',
              label: 'Deployment',
            },
            {
              type: 'doc',
              id: 'pol/quest/transaction',
              label: 'Transaction',
            },
          ],
        },
      ],
    },
    {
      type: 'category',
      label: '⚙️ Tools',
      collapsible: true,
      items: [
        {
          type: 'doc',
          id: 'tools/web3-contract-plugin',
          label: '🔌 Web3 Plugin Contracts',
        },
        // {
        //   type: 'doc',
        //   id: 'tools/solidity-database',
        //   label: '🧭 Solidity Database',
        // },
        // {
        //   type: 'doc',
        //   id: 'tools/awesome-solidity-learn',
        //   label: '👓 Awesome Solidity Learn',
        // },
      ],
    },
    {
      type: 'category',
      label: 'Socials',
      collapsible: false,
      collapsed: false,
      items: [
        {
          type: 'link',
          label: '⭐ X (Twitter)',
          href: 'https://x.com/SolideProject',
        },
        {
          type: 'link',
          label: '⭐ Proof of Learn (Twitter)',
          href: 'https://x.com/0xProofOfLearn',
        },
        {
          type: 'link',
          label: '⭐ Github',
          href: 'https://github.com/solide-project',
        },
      ],
    },
  ],

};

export default sidebars;
