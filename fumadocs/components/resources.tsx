import { Card, Cards } from 'fumadocs-ui/components/card';
import { Code, Github } from 'lucide-react';

interface IDEResourcesProps {
    name: string
    github: string
    site: string
}

export default function IDEResources({ name, github, site }: IDEResourcesProps) {
    return (
        <Cards>
            <Card className="bg-[#fff] dark:bg-[#0a0a0a] shadow-none! [&_svg]:size-8"
                icon={<Github color="rgb(147 197 253)" />}
                href={github} external={true} title="Source Code">
                {github}
            </Card>
            <Card className="bg-[#fff] dark:bg-[#0a0a0a] shadow-none! [&_svg]:size-8"
                icon={<Code color="rgb(253 224 71)" />}
                href={`https://${site}.polearn.xyz`} external={true} title={`${name}`}>
                {`https://${site}${site && "."}polearn.xyz`}
            </Card>
        </Cards>
    )
}