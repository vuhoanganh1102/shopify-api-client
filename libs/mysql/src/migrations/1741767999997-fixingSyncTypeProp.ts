import { MigrationInterface, QueryRunner } from 'typeorm';

export class FixingSyncTypeProp1741767999997 implements MigrationInterface {
  name = 'FixingSyncTypeProp1741767999997';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX \`IDX_176b502c5ebd6e72cafbd9d6f7\` ON \`products\``,
    );
    await queryRunner.query(
      `DROP INDEX \`IDX_5f5615ef4dd53a62ece014d308\` ON \`facebook_member_token\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`products\` ADD UNIQUE INDEX \`IDX_176b502c5ebd6e72cafbd9d6f7\` (\`user_id\`)`,
    );
    await queryRunner.query(
      `ALTER TABLE \`products\` DROP COLUMN \`sync_facebook\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`products\` ADD \`sync_facebook\` int NULL DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`facebook_member_token\` ADD UNIQUE INDEX \`IDX_5f5615ef4dd53a62ece014d308\` (\`shopify_user_id\`)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`facebook_member_token\` DROP INDEX \`IDX_5f5615ef4dd53a62ece014d308\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`products\` DROP COLUMN \`sync_facebook\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`products\` ADD \`sync_facebook\` varchar(255) NULL DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`products\` DROP INDEX \`IDX_176b502c5ebd6e72cafbd9d6f7\``,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX \`IDX_5f5615ef4dd53a62ece014d308\` ON \`facebook_member_token\` (\`shopify_user_id\`)`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX \`IDX_176b502c5ebd6e72cafbd9d6f7\` ON \`products\` (\`user_id\`)`,
    );
  }
}
