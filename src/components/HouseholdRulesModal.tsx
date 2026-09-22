import React from 'react';
import { HouseholdParameters } from '../types';
import { FamilyProfileModal } from './FamilyProfileModal';

interface HouseholdRulesModalProps {
  isOpen: boolean;
  onClose: () => void;
  parameters: HouseholdParameters;
  onSaveParameters: (updated: HouseholdParameters) => void;
  onResetParameters: () => void;
  isOnboarding?: boolean;
}

export const HouseholdRulesModal: React.FC<HouseholdRulesModalProps> = (props) => {
  return <FamilyProfileModal {...props} />;
};
