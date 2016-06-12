import * as React from 'react';
import {Component, PropTypes} from 'react';
import {composeWithTracker} from 'react-komposer';

const styles = require('./modal.styl');

import {UpdateModal} from './update_modal';
import {RemoveModal} from './remove_modal';
import {closeModal} from '../../actions/modals';

export interface IModalProps {
    type?: string;
    data?: any;
}

class Container extends Component<IModalProps, any> {
    render() {
        if (!this.props.type) {
            return null;
        }

        return <Modal {...this.props} />;
    }
}

class Modal extends Component<IModalProps, {}> {
    private _scrollFn;

    onClose() {
        closeModal(void 0);
    }

    lockScroll(x, y) {
       return () => {
           window.scrollTo(x, y);
       };
    }

    componentDidMount() {
        this._scrollFn = this.lockScroll(window.pageXOffset, window.pageYOffset);
        window.addEventListener('scroll', this._scrollFn);
    }

    componentWillUnmount() {
        window.removeEventListener('scroll', this._scrollFn);
    }

    render() {
        const {data, type} = this.props;

        let contentComponent;
        switch (type) {
            case 'UPDATE_POST':
                contentComponent = <UpdateModal close={this.onClose} post={data} />;
                break;
            case 'REMOVE_POST':
                contentComponent = <RemoveModal close={this.onClose} post={data} />;
                break;
            default:
                contentComponent = null;
        }

        return (
            <div className={styles.overlay}>
                <section className={styles.modal}>
                    <aside className={styles.close} onClick={this.onClose}>×</aside>
                    {contentComponent}
                </section>
            </div>
        );
    }
}

export default composeWithTracker((_, onData) => {
    const data = Session.get('MODAL_DATA');
    const type = Session.get('MODAL_TYPE');

    onData(null, { data, type });
})(Container);

