import { ActivityIcon } from '@sanity/icons';
import { Badge, Box, Card, Container, Flex, Heading, Spinner, Stack, Text } from '@sanity/ui';
import { useEffect, useState } from 'react';
import { type Tool, useClient } from 'sanity';
import { IntentLink } from 'sanity/router';

import { CHECKED_TYPES, CONTENT_HEALTH_QUERY, editorialIssues } from '../checks';

type HealthRow = Parameters<typeof editorialIssues>[0] & {
  _id: string;
  _type: string;
  title?: string;
  _updatedAt: string;
};

function ContentHealth() {
  const client = useClient({ apiVersion: '2026-10-01' });
  const [rows, setRows] = useState<HealthRow[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    client
      .fetch<HealthRow[]>(CONTENT_HEALTH_QUERY, { types: CHECKED_TYPES })
      .then(setRows)
      .catch((err: Error) => setError(err.message));
  }, [client]);

  return (
    <Container width={2} padding={4}>
      <Stack space={4}>
        <Heading size={2}>Content health</Heading>
        <Text muted size={1}>
          Published documents that miss SEO descriptions, excerpts or summaries.
        </Text>
        {error ? (
          <Card tone="critical" padding={3} radius={2}>
            <Text>{error}</Text>
          </Card>
        ) : null}
        {!rows && !error ? <Spinner muted /> : null}
        {rows?.length === 0 ? (
          <Card tone="positive" padding={3} radius={2}>
            <Text>All published content passes the checks.</Text>
          </Card>
        ) : null}
        {rows?.map((row) => (
          <Card key={row._id} padding={3} radius={2} border>
            <Flex align="center" gap={3}>
              <Badge>{row._type}</Badge>
              <Box flex={1}>
                <Stack space={2}>
                  <Text weight="semibold">
                    <IntentLink intent="edit" params={{ id: row._id, type: row._type }}>
                      {row.title || 'Untitled'}
                    </IntentLink>
                  </Text>
                  <Text size={1} muted>
                    {editorialIssues(row).join(' ')}
                  </Text>
                </Stack>
              </Box>
            </Flex>
          </Card>
        ))}
      </Stack>
    </Container>
  );
}

export const contentHealthTool: Tool = {
  name: 'content-health',
  title: 'Content health',
  icon: ActivityIcon,
  component: ContentHealth,
};
