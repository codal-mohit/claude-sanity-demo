import type { DocumentActionComponent } from 'sanity';

import { editorialIssues } from '../checks';

// Wraps the built-in Publish action and disables it until editorial checks pass.
export function withEditorialChecks(publish: DocumentActionComponent): DocumentActionComponent {
  const CheckedPublish: DocumentActionComponent = (props) => {
    const result = publish(props);
    const issues = editorialIssues(props.draft ?? props.published);
    if (!result || issues.length === 0) return result;

    return {
      ...result,
      disabled: true,
      title: `Before publishing: ${issues.join(' ')}`,
    };
  };
  CheckedPublish.action = publish.action;
  return CheckedPublish;
}
