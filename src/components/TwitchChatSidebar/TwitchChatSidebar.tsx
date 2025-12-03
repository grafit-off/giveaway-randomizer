import { TwitchChatSidebarProps } from '../../models/TwitchChatSidebarProps'
import styles from './TwitchChatSidebar.module.scss'

export function TwitchChatSidebar({ channel, isVisible, onToggle, disabled = false }: TwitchChatSidebarProps) {
  const chatUrl = `https://www.twitch.tv/embed/${channel}/chat?parent=${window.location.hostname}&darkpopout`

  const handleToggle = () => {
    if (!disabled) {
      onToggle()
    }
  }

  if (!isVisible) {
    return (
      <div
        className={`${styles.twitchChatSidebar} ${styles.twitchChatSidebarHidden} ${disabled ? styles.twitchChatSidebarDisabled : ''}`}
        onClick={handleToggle}
        title={disabled ? "Cannot toggle chat during animation" : "Show Twitch Chat"}
        role="button"
        tabIndex={disabled ? -1 : 0}
        onKeyDown={(e) => {
          if (!disabled && (e.key === 'Enter' || e.key === ' ')) {
            e.preventDefault()
            handleToggle()
          }
        }}
        aria-label="Show Twitch Chat"
        aria-disabled={disabled}
      >
        <div className={styles.twitchChatToggleIcon}>▶</div>
      </div>
    )
  }

  return (
    <div className={styles.twitchChatSidebarContainer}>
      <div className={styles.twitchChatSidebar}>
        <div className={styles.twitchChatHeader}>
          <div className={styles.twitchChatHeaderContent}>
            <h3 className={styles.twitchChatTitle}>Twitch Chat</h3>
            <a
              href={`https://www.twitch.tv/${channel}`}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.twitchChatLink}
            >
              {channel}
            </a>
          </div>
          <button
            className={styles.twitchChatCloseButton}
            onClick={handleToggle}
            disabled={disabled}
            title={disabled ? "Cannot toggle chat during animation" : "Hide Twitch Chat"}
            aria-label="Hide Twitch Chat"
          >
            ×
          </button>
        </div>
        <iframe
          src={chatUrl}
          className={styles.twitchChatIframe}
          title="Twitch Chat"
          frameBorder="0"
          scrolling="yes"
          allowFullScreen={false}
        />
      </div>
    </div>
  )
}
