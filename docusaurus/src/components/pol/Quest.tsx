import documentation from '@site/static/documentation.json';
import { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import CodeBlock from '@theme/CodeBlock';

const getComponentSummary = (children: any) => {
    return children?.comment?.summary?.filter(x => x.kind === "text").pop().text
}

const foundComponent = (documentation: any, name: string) => {
    return documentation.children?.filter(x => x.name === name).pop()
}

const getExamples = (children: any): any[] => {
    return children?.comment?.blockTags?.filter(x => x.tag === "@example") || []
}

const renderExamples = (example: any) => {
    return example.content.map(x => x.text).join("\n")
}

const renderExamplesText = (example: any) => {
    return example.content
        .map(x => x.text).join("\n")
        .replace(/^```[a-z]*\n/, '') // Remove the opening code block (```ts\n)
        .replace(/```$/, '')         // Remove the closing code block (```)
        .trim();                     // Trim any extra whitespace
}

const Quest = ({ componentName, rawDescription = true }) => {
    const [component, setComponent] = useState<any>({
        children: []
    })

    useEffect(() => {
        const component = foundComponent(documentation, componentName)
        console.log(component)
        setComponent(component)
    }, [])

    return <div>
        <div style={{ padding: "16px 0" }}>{getComponentSummary(component)}</div>

        <table>
            <tr>
                <th>Field</th>
                <th>Description</th>
                <th>Example</th>
            </tr>

            {component.children?.map((field, i) => <tr key={i}>
                <td>{field.name}</td>
                <td>{getComponentSummary(field)}</td>
                <td>
                    {getExamples(field).map((example, j) => <div key={j}>
                        {rawDescription
                            ? <>{renderExamplesText(example)}</>
                            : <ReactMarkdown>{renderExamples(example)}</ReactMarkdown>}
                    </div>)}
                </td>
            </tr>)}
        </table>

        {component.comment?.blockTags && <>
            <h3>Examples</h3>
            {getExamples(component).map((x, index) => <div key={index}>
                <ReactMarkdown components={{
                    pre: ({ node, ...props }) => {
                        return <>{props.children}</>
                    },
                    code: ({ node, ...props }) => {
                        return <CodeBlock className="language-json" showLineNumbers={true}  >
                            {props.children}
                        </CodeBlock>
                    },
                }}>{renderExamples(x)}</ReactMarkdown>
            </div>)}
        </>}

        {/* <CodeBlock className="language-bash" showLineNumbers={true}  >
            {"yarn install\nyarn start"}
        </CodeBlock> */}
    </div>
}

export default Quest;