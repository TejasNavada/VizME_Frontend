import React from "react";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import rehypeKatex from "rehype-katex";
import remarkMath from "remark-math";

const MarkdownWithLatex = ({ markdownText }) => {

    const preprocessMarkdown = (markdownText) => {
        if(markdownText==null){
            return markdownText
        }
        // Replace \[ with $$ and \] with $$ to ensure compatibility
        const processedText = markdownText
        .replace(/\\\[/g, '$$$')  // Replace all occurrences of \[ with $$
        .replace(/\\\]/g, '$$$') // Replace all occurrences of \] with $$
        .replace(/\\\(/g, '$$$') // Replace all occurrences of \] with $$
        .replace(/\\\)/g, '$$$'); // Replace all occurrences of \] with $$
        
        return processedText;
    };      

    const remarkMathOptions = {
        singleDollarTextMath: false,
    }


    return (
    <ReactMarkdown
    className="markdown-content"
    children={preprocessMarkdown(markdownText)}
    remarkPlugins={[[remarkMath, remarkMathOptions]]} // Pass options as the second element of the array
    rehypePlugins={[rehypeRaw, rehypeKatex]} // Include rehypeRaw for HTML, rehypeKatex for LaTeX
    />
    );
};

export default MarkdownWithLatex;