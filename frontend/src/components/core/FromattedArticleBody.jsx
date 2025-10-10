import React from 'react';

const isHeading = (text) => {
  const trimmedText = text.trim();
  return trimmedText.length > 0 && trimmedText.length < 80 && !trimmedText.endsWith('.');
};

const FormattedArticleBody = ({ text }) => {
  if (!text) {
    return null;
  }

  const blocks = text.split('\n\n');

  return (
    <div>
      {blocks.map((block, index) => {

        if (isHeading(block)) {
          return (
            <h2 key={index} className="text-2xl font-bold mt-6 mb-2 dark:text-gray-200">
              {block}
            </h2>
          );
        }

        return (
          <p key={index} className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
            {block}
          </p>
        );
      })}
    </div>
  );
};

export default FormattedArticleBody;