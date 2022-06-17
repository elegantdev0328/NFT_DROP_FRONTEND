import React from 'react';
import { Stack, Typography } from '@mui/material';
import Image from 'next/image';
import { Container } from './styles';
import { SerumTokenInfoType } from '../../../types';

type ComponentProps = {
    item: SerumTokenInfoType;
};

const SerumBox: React.FC<ComponentProps> = ({ item }): JSX.Element => {
    return (
        <Container spacing={2}>
            <Image src="/assets/nft-items/serum.png" width={166} height={166} alt="" className="serum_img" />
            <Stack spacing={1}>
                <Typography fontSize={16} fontWeight={700}>
                    {item.title}
                </Typography>
                <Typography fontSize={16} fontWeight={400} color="#979797">
                    {item.count}
                </Typography>
            </Stack>
        </Container>
    );
};

export default SerumBox;