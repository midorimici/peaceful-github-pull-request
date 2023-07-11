import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './styles.scss';
import { faClose } from '@fortawesome/free-solid-svg-icons';
import React from 'react';
import { useIsEnabled } from '~/options/components/domain/hooks/useIsEnabled';
import { useList } from '~/options/components/domain/hooks/useList';
import { CheckCircle } from '~/options/components/shared/CheckCircle';
import { t } from '~/lib/i18n';

export const AvatarImageReplacementSection: React.FC = () => {
  const replaceImageLabel = t('replaceAvatarImages');
  const skipUserLabel = t('skipUser');
  const regexSupportedLabel = t('regexSupported');

  const { list: userNames, deleteItem: deleteUserName, handleKeyDown } = useList('skipUsers');

  const { isEnabled, toggle } = useIsEnabled('isAvatarImageReplacementEnabled');

  const sectionClassName = `config-container ${isEnabled ? 'active' : 'inactive'}`;

  return (
    <section className={sectionClassName}>
      <label className="config-title-container" onClick={toggle}>
        <CheckCircle isChecked={isEnabled} />
        {replaceImageLabel}
      </label>
      {isEnabled && (
        <>
          <label className="label">
            {skipUserLabel}
            <div className="inline-form">
              <input
                type="text"
                placeholder={regexSupportedLabel}
                maxLength={100}
                onKeyDown={handleKeyDown}
              />
            </div>
          </label>
          <UserNameList userNames={userNames} deleteUserName={deleteUserName} />
        </>
      )}
    </section>
  );
};

type UserNameListProps = {
  userNames: string[];
  deleteUserName: (name: string) => void;
};

const UserNameList: React.FC<UserNameListProps> = ({ userNames, deleteUserName }) => {
  return (
    <div className="username-list">
      {userNames.map((userName: string) => (
        <UserName name={userName} onDelete={() => deleteUserName(userName)} />
      ))}
    </div>
  );
};

type UserNameProps = {
  name: string;
  onDelete: () => void;
};

const UserName: React.FC<UserNameProps> = ({ name, onDelete }) => {
  return (
    <span className="username-item">
      {name}
      <FontAwesomeIcon cursor="pointer" icon={faClose} onClick={onDelete} />
    </span>
  );
};
