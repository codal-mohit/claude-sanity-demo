import { CheckmarkCircleIcon, EyeOpenIcon, ResetIcon } from '@sanity/icons';
import { useCurrentUser, useDocumentOperation, type DocumentActionComponent } from 'sanity';

import { isReviewer, reviewStatusOf, type ReviewStatus } from '../workflow';

function useSetStatus(id: string, type: string) {
  const { patch } = useDocumentOperation(id, type);
  return (status: ReviewStatus) => patch.execute([{ set: { reviewStatus: status } }]);
}

export const RequestReviewAction: DocumentActionComponent = (props) => {
  const setStatus = useSetStatus(props.id, props.type);
  const status = reviewStatusOf(props.draft ?? props.published);
  if (status !== 'draft' || !props.draft) return null;
  return {
    label: 'Request review',
    icon: EyeOpenIcon,
    onHandle: () => {
      setStatus('in-review');
      props.onComplete();
    },
  };
};

export const ApproveAction: DocumentActionComponent = (props) => {
  const setStatus = useSetStatus(props.id, props.type);
  const user = useCurrentUser();
  const status = reviewStatusOf(props.draft ?? props.published);
  if (status !== 'in-review') return null;
  const allowed = isReviewer(user?.roles);
  return {
    label: 'Approve',
    icon: CheckmarkCircleIcon,
    tone: 'positive',
    disabled: !allowed,
    title: allowed ? undefined : 'Only editors and administrators can approve.',
    onHandle: () => {
      setStatus('approved');
      props.onComplete();
    },
  };
};

export const BackToDraftAction: DocumentActionComponent = (props) => {
  const setStatus = useSetStatus(props.id, props.type);
  const status = reviewStatusOf(props.draft ?? props.published);
  if (status === 'draft') return null;
  return {
    label: 'Back to draft',
    icon: ResetIcon,
    onHandle: () => {
      setStatus('draft');
      props.onComplete();
    },
  };
};
