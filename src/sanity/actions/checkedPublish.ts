import { useCurrentUser, type DocumentActionComponent } from 'sanity';

import { editorialIssues } from '../checks';
import { publishBlockReason, reviewStatusOf } from '../workflow';

// Wraps the built-in Publish action: disabled until editorial checks pass and,
// for contributors, until an editor approved the document.
export function withEditorialChecks(publish: DocumentActionComponent): DocumentActionComponent {
  const CheckedPublish: DocumentActionComponent = (props) => {
    const result = publish(props);
    const user = useCurrentUser();
    const doc = props.draft ?? props.published;
    if (!result) return result;

    const reasons = [
      ...editorialIssues(doc),
      publishBlockReason(reviewStatusOf(doc), user?.roles),
    ].filter((reason): reason is string => Boolean(reason));
    if (reasons.length === 0) return result;

    return {
      ...result,
      disabled: true,
      title: `Before publishing: ${reasons.join(' ')}`,
    };
  };
  CheckedPublish.action = publish.action;
  return CheckedPublish;
}
