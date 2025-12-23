import fs from 'fs';
import path from 'path';

/**
 * Convert catching-unicorns.txt to clean markdown format
 */

interface Chapter {
  title: string;
  startLine: number;
  endLine?: number;
  footnotes: Map<number, string>;
}

// Chapter definitions with approximate line numbers
const CHAPTERS: Omit<Chapter, 'endLine' | 'footnotes'>[] = [
  { title: 'Preface', startLine: 142 },
  { title: 'Introduction', startLine: 251 },
  { title: 'The Role of Exographics in the Discovery of Ideas', startLine: 1106 },
  { title: 'The Growth of the Ideasphere and the e-Class', startLine: 1794 },
  { title: 'The Diaconatic: A Theory of Embodied Ideation', startLine: 1987 },
  { title: 'The Exographic Revolution', startLine: 2937 },
  { title: 'Exographics and the Prepared Mind', startLine: 3168 },
  { title: 'Collaboration and Networked Imaginations', startLine: 3607 },
  { title: 'Collaboration and Communication', startLine: 4066 },
  { title: 'The Evolution of Exographic Technologies', startLine: 4554 },
  { title: 'The Globalization of Ideas', startLine: 5382 },
  { title: 'The River Civilizations and Their e-Class Forays', startLine: 5711 },
  { title: 'The Greek Miracle', startLine: 6630 },
  { title: 'The Roman Contribution', startLine: 6955 },
  { title: 'The East Through the Middle Ages', startLine: 7244 },
  { title: 'The Rise of Western Europe', startLine: 7503 },
  { title: 'The US and Digital Exographics', startLine: 8434 },
  { title: 'Does Exographics Explain "The Great Divide"?', startLine: 8639 },
  { title: 'The Rise of Techno-Literate Culture', startLine: 9315 },
];

// Part definitions
const PART_I_START = 1102;
const PART_II_START = 5381;

// Sections to remove
const ACKNOWLEDGEMENTS_START = 106;
const ACKNOWLEDGEMENTS_END = 141;
const BIBLIOGRAPHY_START = 9935;
const INDEX_START = 10696;
const ABOUT_AUTHORS_START = 11093;

/**
 * Check if a line is a page header
 */
const isPageHeader = (line: string): boolean => {
  const trimmed = line.trim();
  
  // Pattern: lowercase text followed by spaces and a number
  const headerPattern1 = /^[a-z\s]+\s+\d+\s*$/i;
  const headerPattern2 = /^\d+\s+[a-z\s]+\s*$/i;
  
  if (headerPattern1.test(trimmed) || headerPattern2.test(trimmed)) {
    return true;
  }
  
  // Very short lines matching header patterns
  if (trimmed.length < 50 && /^(introduction|catching unicorns|preface|part [iv]+)/i.test(trimmed)) {
    return true;
  }
  
  return false;
};

/**
 * Check if a line is part of a footnote in the margin
 */
const isFootnoteLine = (line: string): boolean => {
  const trimmed = line.trim();
  if (trimmed.length === 0) return false;
  
  const leadingSpaces = line.length - trimmed.length;
  
  // Right-aligned content (lots of leading spaces)
  if (leadingSpaces > 50) {
    // Check for citation patterns
    if (
      /^\d+\s*$/.test(trimmed) || // Just a number
      /^[A-Z][a-z]+ [A-Z]/.test(trimmed) || // Author names
      /Press|University|Journal|Cambridge|Princeton|Chicago|Oxford/.test(trimmed) ||
      /^\d{4}/.test(trimmed) || // Year
      /^In |^ed\. by|^Ibid\.|^p\./.test(trimmed) // Citation patterns
    ) {
      return true;
    }
  }
  
  return false;
};

/**
 * Extract footnote number from a line
 */
const extractFootnoteNumber = (line: string): number | null => {
  const trimmed = line.trim();
  const match = trimmed.match(/^(\d+)\s*$/);
  if (match) {
    const num = parseInt(match[1], 10);
    if (num > 0 && num < 100) return num;
  }
  return null;
};

/**
 * Process a section (preface, introduction, or chapter) and extract content + footnotes
 */
const processSection = (
  lines: string[],
  startLine: number,
  endLine: number
): { content: string[]; footnotes: Map<number, string> } => {
  const content: string[] = [];
  const footnotes = new Map<number, string>();
  
  let i = startLine - 1;
  const endIdx = endLine - 1;
  
  while (i < endIdx && i < lines.length) {
    const line = lines[i];
    const lineNum = i + 1;
    
    // Skip unwanted sections
    if (lineNum >= BIBLIOGRAPHY_START) break;
    
    // Skip page headers
    if (isPageHeader(line)) {
      i++;
      continue;
    }
    
    // Check if this line ends with a footnote reference
    // Pattern: text ending with a small number (1-99) that's likely a footnote
    const trimmed = line.trim();
    
    // Look for number at end, but not if it's part of a larger number (like 10,000 or 300,000)
    const footnoteMatch = trimmed.match(/([^0-9,\s])\s*(\d{1,2})\s*$/);
    
    if (footnoteMatch) {
      const footnoteNum = parseInt(footnoteMatch[2], 10);
      
      // Only consider small numbers as footnotes (1-50 typically)
      if (footnoteNum > 0 && footnoteNum <= 50) {
        // Check if next line confirms it's a footnote (has number in margin or citation)
        if (i + 1 < lines.length) {
          const nextLine = lines[i + 1];
          const nextTrimmed = nextLine.trim();
          const nextLeadingSpaces = nextLine.length - nextTrimmed.length;
          
          // Next line has same number in margin OR starts with citation
          if (
            (nextLeadingSpaces > 50 && nextTrimmed === String(footnoteNum)) ||
            (nextLeadingSpaces > 50 && isFootnoteLine(nextLine))
          ) {
            // This is a footnote reference
            // Remove the number from the line
            const cleanedLine = trimmed.replace(/\d+\s*$/, '').trim();
            if (cleanedLine.length > 0) {
              content.push(cleanedLine);
            }
            
            // Collect footnote content
            i++; // Move to next line
            const footnoteLines: string[] = [];
            
            // Skip the number line if it's just the number
            if (nextTrimmed === String(footnoteNum)) {
              i++;
            }
            
            // Collect footnote text lines
            let consecutiveEmptyLines = 0;
            while (i < endIdx && i < lines.length) {
              const footnoteLine = lines[i];
              const footnoteTrimmed = footnoteLine.trim();
              
              if (isFootnoteLine(footnoteLine)) {
                footnoteLines.push(footnoteTrimmed);
                consecutiveEmptyLines = 0;
                i++;
              } else if (footnoteTrimmed.length === 0) {
                consecutiveEmptyLines++;
                if (consecutiveEmptyLines > 1 && footnoteLines.length > 0) {
                  // Two empty lines - end of footnote
                  i++;
                  break;
                }
                i++;
              } else {
                // Not a footnote line - end of footnote
                break;
              }
            }
            
            // Store footnote
            if (footnoteLines.length > 0) {
              const footnoteText = footnoteLines.join(' ').trim();
              if (footnoteText.length > 0) {
                footnotes.set(footnoteNum, footnoteText);
              }
            }
            
            continue;
          }
        }
      }
    }
    
    // Skip standalone footnote lines
    if (isFootnoteLine(line)) {
      i++;
      continue;
    }
    
    // Skip standalone roman numerals (page numbers)
    if (/^(xii|xi|x|ix|viii|vii|vi|v|iv|iii|ii|i)$/i.test(trimmed)) {
      i++;
      continue;
    }
    
    // Skip empty lines (but keep some for paragraph breaks)
    if (trimmed.length === 0) {
      // Keep if previous line wasn't empty (preserve paragraph breaks)
      if (content.length > 0 && content[content.length - 1].trim().length > 0) {
        content.push('');
      }
      i++;
      continue;
    }
    
    // Add content line
    content.push(trimmed);
    i++;
  }
  
  return { content, footnotes };
};

/**
 * Join paragraphs and fix hyphenation
 */
const joinParagraphs = (lines: string[]): string => {
  let text = lines.join('\n');
  
  // Fix hyphenation: "word-\nword" -> "wordword"
  text = text.replace(/(\w+)-\s*\n\s*(\w+)/g, '$1$2');
  
  // Remove standalone roman numerals (page numbers like xii, xi, x, etc.)
  text = text.replace(/\n\s*(xii|xi|x|ix|viii|vii|vi|v|iv|iii|ii|i)\s*\n/gi, '\n');
  
  // Remove roman numerals that appear with punctuation (like ". xii.")
  text = text.replace(/\.\s*(xii|xi|x|ix|viii|vii|vi|v|iv|iii|ii|i)\./gi, '.');
  
  // Remove leftover footnote fragments
  text = text.replace(/\s+[A-Z][a-z]+ [A-Z][a-z]+\. [A-Z][a-z]+: [A-Z][a-z]+ Press[^.]*/g, '');
  text = text.replace(/\s+Press|University|Journal|Cambridge|Princeton|Chicago[^.]*/g, '');
  
  // Remove standalone numbers that are likely leftover footnote markers
  text = text.replace(/\n\s*\d+\s*\n/g, '\n');
  
  // Join lines that end with a comma (sentence continues)
  text = text.replace(/,\s*\n\s*/g, ', ');
  
  // Join lines that end with lowercase and next line starts with lowercase (broken sentence)
  text = text.replace(/([a-z])\s*\n\s*([a-z])/g, '$1 $2');
  
  // Join lines ending with prepositions/articles and next line starts lowercase
  text = text.replace(/(the|a|an|of|in|to|for|and|or|but|with|at|by|from|as)\s*\n\s*([a-z])/gi, '$1 $2');
  
  // Normalize whitespace
  text = text.replace(/\n{3,}/g, '\n\n'); // Max 2 newlines
  text = text.replace(/[ \t]+/g, ' '); // Multiple spaces to single
  
  return text.trim();
};

/**
 * Convert to markdown format
 */
const convertToMarkdown = (lines: string[]): string => {
  const markdown: string[] = [];
  
  // Title
  markdown.push('# Catching Unicorns');
  markdown.push('');
  markdown.push('*The Exographic Revolution and the Rise of Techno-Literate Culture*');
  markdown.push('');
  markdown.push('---');
  markdown.push('');
  
  // Process Preface
  const prefaceEnd = CHAPTERS[1].startLine - 1;
  const { content: prefaceContent, footnotes: prefaceFootnotes } = processSection(
    lines,
    CHAPTERS[0].startLine,
    prefaceEnd
  );
  
  if (prefaceContent.length > 0) {
    markdown.push('# Preface');
    markdown.push('');
    let prefaceText = joinParagraphs(prefaceContent);
    
    // Note: Footnote references are complex to automatically detect
    // They were already removed during processing, so we skip adding them back
    // Manual cleanup may be needed for footnotes
    
    markdown.push(prefaceText);
    markdown.push('');
    
    // Add footnotes
    if (prefaceFootnotes.size > 0) {
      const sorted = Array.from(prefaceFootnotes.entries()).sort((a, b) => a[0] - b[0]);
      for (const [num, text] of sorted) {
        markdown.push(`[^${num}]: ${text}`);
      }
      markdown.push('');
    }
  }
  
  // Process Introduction
  const introEnd = CHAPTERS[2].startLine - 1;
  const { content: introContent, footnotes: introFootnotes } = processSection(
    lines,
    CHAPTERS[1].startLine,
    introEnd
  );
  
  if (introContent.length > 0) {
    markdown.push('# Introduction');
    markdown.push('');
    let introText = joinParagraphs(introContent);
    
    // Note: Footnote references are complex to automatically detect
    // They were already removed during processing, so we skip adding them back
    
    markdown.push(introText);
    markdown.push('');
    
    // Add footnotes
    if (introFootnotes.size > 0) {
      const sorted = Array.from(introFootnotes.entries()).sort((a, b) => a[0] - b[0]);
      for (const [num, text] of sorted) {
        markdown.push(`[^${num}]: ${text}`);
      }
      markdown.push('');
    }
  }
  
  // Part I
  markdown.push('# Part I: Capturing the Unicorns of the Mind');
  markdown.push('');
  
  // Process chapters
  for (let i = 2; i < CHAPTERS.length; i++) {
    const chapter = CHAPTERS[i];
    
    // Check if we're starting Part II
    if (chapter.startLine >= PART_II_START && i > 2 && CHAPTERS[i - 1].startLine < PART_II_START) {
      markdown.push('');
      markdown.push('# Part II: The Rise of Techno-Literate Culture');
      markdown.push('');
    }
    
    // Determine end line
    const endLine = i + 1 < CHAPTERS.length 
      ? CHAPTERS[i + 1].startLine - 1 
      : BIBLIOGRAPHY_START - 1;
    
    // Process chapter
    const { content: chapterContent, footnotes: chapterFootnotes } = processSection(
      lines,
      chapter.startLine,
      endLine
    );
    
    if (chapterContent.length > 0) {
      // Chapter heading
      const chapterNum = i - 1; // Chapters start at 1 (after Preface and Introduction)
      markdown.push(`## Chapter ${chapterNum}: ${chapter.title}`);
      markdown.push('');
      
      // Process chapter text
      let chapterText = joinParagraphs(chapterContent);
      
      // Note: Footnote references are complex to automatically detect
      // They were already removed during processing, so we skip adding them back
      
      markdown.push(chapterText);
      markdown.push('');
      
      // Add footnotes at end of chapter
      if (chapterFootnotes.size > 0) {
        const sorted = Array.from(chapterFootnotes.entries()).sort((a, b) => a[0] - b[0]);
        for (const [num, text] of sorted) {
          markdown.push(`[^${num}]: ${text}`);
        }
        markdown.push('');
      }
    }
  }
  
  return markdown.join('\n');
};

/**
 * Main execution
 */
const main = () => {
  const inputPath = path.resolve(__dirname, 'catching-unicorns.txt');
  const outputPath = path.resolve(__dirname, 'catching-unicorns.md');
  
  if (!fs.existsSync(inputPath)) {
    console.error(`Input file not found: ${inputPath}`);
    process.exit(1);
  }
  
  console.log('Reading input file...');
  const content = fs.readFileSync(inputPath, 'utf-8');
  const lines = content.split('\n');
  console.log(`  Read ${lines.length} lines`);
  
  console.log('Converting to markdown...');
  const markdown = convertToMarkdown(lines);
  
  console.log('Writing output file...');
  fs.writeFileSync(outputPath, markdown, 'utf-8');
  
  console.log(`✅ Conversion complete!`);
  console.log(`   Output: ${outputPath}`);
  console.log(`   Size: ${(markdown.length / 1024).toFixed(2)} KB`);
};

if (require.main === module) {
  main();
}

export { convertToMarkdown };
