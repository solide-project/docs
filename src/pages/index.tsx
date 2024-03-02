import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import { useColorMode } from '@docusaurus/theme-common';

import { Icon } from '@iconify/react'
import { useEffect, useState } from 'react';

const homepageConfig = {
  pill: '🤗 Welcome to Solide Docs!',
  features: [
    {
      title: 'Read Docs',
      description: 'Description 3',
      icon: 'simple-icons:docusaurus',
      link: {
        href: '/docs/intro',
        local: true
      }
    },
    {
      title: 'Solide Smart Contract Hub',
      description: 'Explore and learn about smart contracts',
      icon: 'oui:documentation',
      link: {
        href: 'https://solide-dapp.vercel.app/ethereum',
        local: false
      }
    },
    {
      title: 'Solide IDE',
      description: 'Load and interact with smart contracts',
      icon: 'lucide:codepen',
      link: {
        href: 'https://solidewidget.azurewebsites.net/address/1/0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599',
        local: false
      }
    },
  ]
}

function HomepageHeader() {
  const { isDarkTheme } = useColorMode();
  const [isDark, setIsDark] = useState<boolean>(false);

  useEffect(() => {
    if (isDarkTheme) {
      setIsDark(true);
    } else {
      setIsDark(false)
    }
  }, [isDarkTheme]);

  return (
    <section className="space-y-6 py-4 md:py-8 lg:py-16">
      <div className="container flex max-w-[64rem] flex-col items-center gap-4 text-center">
        <a
          className="rounded-2xl bg-gray-100 px-4 py-1.5 text-sm font-medium"
          target="_blank"
          href="https://twitter.com/shadcn"
        >
          {homepageConfig.pill}
        </a>
        <h1 className="font-bold text-3xl sm:text-5xl md:text-6xl lg:text-7xl">
          Empowering <span className="text-gradient">Smart Contract</span> Development with <span className='text-gradient-invert'>Solide</span>
        </h1>
      </div>
      <div className="px-4 md:px-16">
        <div className="grid grid-cols-12 pt-2 md:pt-8 gap-4">
          {homepageConfig.features.map((feature, index) =>
            <div key={index} className="col-span-12 md:col-span-4">
              <div className='flex items-center justify-center'>
                <Icon icon={feature.icon} className='text-4xl md:text-7xl' color='#7c3aed' />
              </div>
              <div className='flex items-center justify-center'>
                <Link className={`text-normal md:text-3xl ${isDark ? 'text-white' : 'text-black'}`}
                  to={feature.link.href || "#"} target={feature.link.local ? "_self" : "_blank"}>
                  <div className='font-extrabold mx-2'>{feature.title}
                    <Icon inline={true} icon={feature.link.local ? "lucide:arrow-right" : "lucide:external-link"} />
                  </div>
                </Link>
                <p className="max-w-[20rem] leading-normal hidden md:visible">
                  {feature.description}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default function Home(): JSX.Element {
  return (
    <Layout
      title="Solide Docs"
      description="Solide - Lightweight IDE for Solidity/EVM smart contract">
      <HomepageHeader />
    </Layout>
  );
}