import React from 'react';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Link from '@docusaurus/Link';
import { Icon } from '@iconify/react';
import { useColorMode } from '@docusaurus/theme-common';

export default function FooterWrapper(props) {
  const { siteConfig } = useDocusaurusContext();
  const { isDarkTheme } = useColorMode();

  const getIcon = (icon) => {
    switch (icon) {
      case 'Github':
        return 'mingcute:github-line';
      case 'X':
        return 'akar-icons:twitter-fill';
      case 'App':
        return 'akar-icons:facebook-fill';
    }
  };

  return (
    <div className="grid grid-cols-12 py-8 gap-4 border-t">
      <div className="col-span-12 lg:col-span-4 flex items-center justify-center">
        <Icon className="text-primary" icon="lucide:droplet" width="32" height="32" />
        <span className="text-2xl font-semibold tracking-tight">
          Solide
        </span>
      </div>
      <div className="col-span-12 lg:col-span-4 flex items-center justify-center">
        <span className="">Made with ❤️ by Solide Project</span>
      </div>
      <div className="col-span-12 lg:col-span-4 flex items-center justify-center">
        <div className="flex gap-2">
          {siteConfig.themeConfig.footer.links.map((link) => (
            <Link to={link.to} key={link.label}>
              <Icon icon={getIcon(link.label)} fontSize={24} color={isDarkTheme ? "white" : "black"} size={16} />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}