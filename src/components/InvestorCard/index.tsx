import * as React from 'react';
import Card from '@mui/joy/Card';
import Chip from '@mui/joy/Chip';
import Typography from '@mui/joy/Typography';
import styled from 'styled-components';

const Logo = styled.div`
  width: 2rem;
  height: 2rem;
  border-radius: 100%;
  background-color: purple;
`;

interface InvestorCardInterface {
  title: String;
}

export default function InvestorCard({ title }: InvestorCardInterface) {
  return (
    <Card
      variant='outlined'
      sx={{
        width: 110,
        maxWidth: 160,
        height: 28,
        gap: 0.6,
      }}
    >
      <div style={{ display: 'flex' }}>
        <div
          style={{
            background: '',
            width: '100%',
            height: '60%',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
          }}
        >
          <Logo />
          <Typography level='h2' fontSize='lg' id='card-description' mb={0.5}>
            {title}
          </Typography>
          <Typography
            fontSize='sm'
            aria-describedby='card-description'
            mb={1}
          ></Typography>
        </div>
      </div>
      <div style={{ height: '50%', width: '100%', display: 'flex', gap: '0.2rem' }}>
        {/* <Chip
          variant='outlined'
          size='sm'
          sx={{
            pointerEvents: 'none',
            color: 'var(--prime)',
            borderColor: 'var(--prime)',
            borderRadius: '5px',
          }}
        >
          {investor}
        </Chip> */}
        {/* <Chip
          variant='outlined'
          size='sm'
          sx={{
            pointerEvents: 'none',
            color: 'var(--prime)',
            borderColor: 'var(--prime)',
            borderRadius: '5px',
          }}
        >
          Confidence: {confidence}
        </Chip> */}
      </div>
    </Card>
  );
}
