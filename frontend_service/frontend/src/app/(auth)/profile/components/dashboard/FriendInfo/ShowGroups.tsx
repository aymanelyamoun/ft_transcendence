import React, { useEffect } from 'react';
import styles from './FriendInfo.module.css';
import styled from 'styled-components';

const ShowGroupsContainer = styled.div`

`;

const ShowGroups = React.forwardRef<HTMLDivElement>((props, ref) => {
    return (
      <div className="addChannelOverlay flex justify-center items-center ">
        <div ref={ref} className={styles['info-container']}>
            <ShowGroupsContainer>
                
            </ShowGroupsContainer>
        </div>
      </div>
    );
  });
  
  export default ShowGroups;