import styles from './NavBar.module.css';

export default function Hamburger({ isOpen }: {isOpen: boolean}){

    const classes = isOpen ? `${styles.open} ${styles.hamburger}` : styles.hamburger;

    return(
        <>
            <div className={classes}>
                <div className={`${styles.burger} ${styles.burger1}`} />
                <div className={`${styles.burger} ${styles.burger2}`}  />
                <div className={`${styles.burger} ${styles.burger3}`}  />
            </div>
        </>
    )
}
