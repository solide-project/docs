"use client"

import documentation from '@/lib/documentation.json'
import { CodeBlock, Pre } from 'fumadocs-ui/components/codeblock';
import { useEffect, useState } from 'react';

const getComponentSummary = (children: any) => {
    return children?.comment?.summary?.filter((x: any) => x.kind === "text").pop().text
}

const foundComponent = (documentation: any, name: string) => {
    return documentation.children?.filter((x: any) => x.name === name).pop()
}

const getExamples = (children: any): any[] => {
    return children?.comment?.blockTags?.filter((x: any) => x.tag === "@example") || []
}

const renderExamples = (example: any) => {
    let component = <>
        {
            example.content.map((x: any, index: number) => {
                switch (x.kind) {
                    case "code":
                        return <CodeBlock key={index}>
                            <Pre>{x.text}</Pre>
                        </CodeBlock>
                    case "text":
                    default:
                        return <p key={index}>{x.text}</p>
                }
            })
        }
    </>

    return component
    // return example.content.map((x: any) => x.text).join("\n")
}

const renderExamplesText = (example: any) => {
    return example.content
        .map((x: any) => x.text).join("\n")
        .replace(/^```[a-z]*\n/, '') // Remove the opening code block (```ts\n)
        .replace(/```$/, '')         // Remove the closing code block (```)
        .trim();                     // Trim any extra whitespace
}

export default function Quest({ componentName, rawDescription = true }:
    { componentName: string, rawDescription?: boolean }) {
    const [component, setComponent] = useState<any>({
        children: []
    })

    useEffect(() => {
        const component = foundComponent(documentation, componentName)
        setComponent(component)
    }, [])

    return <div>
        <div style={{ padding: "16px 0" }}>{getComponentSummary(component)}</div>

        {component?.children && <table>
            <thead>
                <tr>
                    <th>Field</th>
                    <th>Description</th>
                    <th>Example</th>
                </tr>
            </thead>

            <tbody>
                {component.children.map((field: any, index: number) => <tr key={index}>
                    <td>{field.name}</td>
                    <td>{getComponentSummary(field)}</td>
                    <td>
                        {getExamples(field).map((example, j) => <div key={j}>
                            {rawDescription
                                ? <>{renderExamplesText(example)}</>
                                : <div>{renderExamples(example)}</div>}
                        </div>)}
                    </td>
                </tr>)}
            </tbody>
        </table>}

        {component?.comment?.blockTags && <>
            <h3>Examples</h3>
            {getExamples(component).map((x, index) => <div key={index}>
                {renderExamples(x)}
            </div>)}
        </>}
    </div>
}
